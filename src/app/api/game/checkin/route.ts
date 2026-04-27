import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/game/checkin — Daily check-in
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Get game state
    const { data: gameState, error: gsError } = await supabase
      .from('game_states')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (gsError || !gameState) {
      return NextResponse.json({ error: 'Estado do jogo não encontrado' }, { status: 404 });
    }

    // Check if already checked in today
    if (gameState.last_checkin && gameState.last_checkin.startsWith(today)) {
      return NextResponse.json({ error: 'Check-in já realizado hoje' }, { status: 400 });
    }

    // Calculate streak
    let newStreak = 1;
    if (gameState.last_checkin) {
      const last = new Date(gameState.last_checkin);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 2) { // 48h tolerance
        newStreak = gameState.streak + 1;
      }
    }

    // Calculate multiplier
    let multiplier = 1.0;
    if (newStreak >= 31) multiplier = 3.0;
    else if (newStreak >= 15) multiplier = 2.0;
    else if (newStreak >= 8) multiplier = 1.5;

    const baseXp = 50;
    const xpGained = Math.round(baseXp * multiplier);
    const newTotalXp = gameState.total_xp + xpGained;

    // Calculate level
    let level = 1;
    let accumulated = 0;
    while (accumulated + level * 100 <= newTotalXp) {
      accumulated += level * 100;
      level++;
    }

    // Update game state
    const { error: updateError } = await supabase
      .from('game_states')
      .update({
        level,
        xp: newTotalXp - accumulated,
        total_xp: newTotalXp,
        streak: newStreak,
        last_checkin: new Date().toISOString(),
        total_days: gameState.total_days + 1,
      })
      .eq('user_id', user.id);

    if (updateError) {
      return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
    }

    // Damage all addictions by 1
    await supabase.rpc('damage_all_addictions', { p_user_id: user.id, p_damage: 1 });

    // Record check-in
    await supabase.from('checkin_history').insert({
      user_id: user.id,
      streak_at_time: newStreak,
      xp_earned: xpGained,
    });

    return NextResponse.json({
      xpGained,
      level,
      streak: newStreak,
      totalXp: newTotalXp,
    });
  } catch (error) {
    console.error('Checkin error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
