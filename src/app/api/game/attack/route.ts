import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/game/attack — Attack an enemy
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { addictionId } = await request.json();
    const today = new Date().toISOString().split('T')[0];

    // Get game state
    const { data: gameState } = await supabase
      .from('game_states')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!gameState) {
      return NextResponse.json({ error: 'Estado não encontrado' }, { status: 404 });
    }

    // Check cooldown
    const cooldowns = gameState.attack_cooldowns || {};
    if (cooldowns[addictionId]?.startsWith(today)) {
      return NextResponse.json({ error: 'Ataque já realizado hoje' }, { status: 400 });
    }

    // Calculate XP
    let multiplier = 1.0;
    if (gameState.streak >= 31) multiplier = 3.0;
    else if (gameState.streak >= 15) multiplier = 2.0;
    else if (gameState.streak >= 8) multiplier = 1.5;

    const xpGained = Math.round(30 * multiplier);
    const newTotalXp = gameState.total_xp + xpGained;

    // Calculate level
    let level = 1;
    let accumulated = 0;
    while (accumulated + level * 100 <= newTotalXp) {
      accumulated += level * 100;
      level++;
    }

    // Update cooldowns
    const newCooldowns = { ...cooldowns, [addictionId]: new Date().toISOString() };

    await supabase
      .from('game_states')
      .update({
        level,
        total_xp: newTotalXp,
        attack_cooldowns: newCooldowns,
      })
      .eq('user_id', user.id);

    // Damage addiction
    const { data: addiction } = await supabase
      .from('addictions')
      .select('power')
      .eq('user_id', user.id)
      .eq('addiction_type', addictionId)
      .single();

    if (addiction) {
      await supabase
        .from('addictions')
        .update({ power: Math.max(0, addiction.power - 2) })
        .eq('user_id', user.id)
        .eq('addiction_type', addictionId);
    }

    return NextResponse.json({ xpGained, level, totalXp: newTotalXp });
  } catch (error) {
    console.error('Attack error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
