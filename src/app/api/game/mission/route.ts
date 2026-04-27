import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/game/mission — Complete a mission
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { missionId, missionXp, missionDamage, addictionType } = await request.json();

    if (!missionId) {
      return NextResponse.json({ error: 'missionId obrigatório' }, { status: 400 });
    }

    // Get game state
    const { data: gameState } = await supabase
      .from('game_states')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!gameState) {
      return NextResponse.json({ error: 'Estado não encontrado' }, { status: 404 });
    }

    // Check if already completed
    if (gameState.completed_mission_ids?.includes(missionId)) {
      return NextResponse.json({ error: 'Missão já completada' }, { status: 400 });
    }

    // Calculate XP with multiplier
    let multiplier = 1.0;
    if (gameState.streak >= 31) multiplier = 3.0;
    else if (gameState.streak >= 15) multiplier = 2.0;
    else if (gameState.streak >= 8) multiplier = 1.5;

    const xpGained = Math.round((missionXp || 100) * multiplier);
    const newTotalXp = gameState.total_xp + xpGained;

    // Calculate level
    let level = 1;
    let accumulated = 0;
    while (accumulated + level * 100 <= newTotalXp) {
      accumulated += level * 100;
      level++;
    }

    const newCompletedIds = [...(gameState.completed_mission_ids || []), missionId];

    // Check if all missions done (bonus)
    let bonusXp = 0;
    const allDone = newCompletedIds.length >= (gameState.daily_mission_ids?.length || 3);
    if (allDone) {
      bonusXp = Math.round(150 * multiplier);
    }

    const finalTotalXp = newTotalXp + bonusXp;
    let finalLevel = level;
    if (bonusXp > 0) {
      let acc2 = 0;
      finalLevel = 1;
      while (acc2 + finalLevel * 100 <= finalTotalXp) {
        acc2 += finalLevel * 100;
        finalLevel++;
      }
    }

    // Update game state
    await supabase
      .from('game_states')
      .update({
        level: finalLevel,
        total_xp: finalTotalXp,
        total_missions: gameState.total_missions + 1,
        completed_mission_ids: newCompletedIds,
        last_mission_date: new Date().toISOString().split('T')[0],
      })
      .eq('user_id', user.id);

    // Damage the linked addiction
    if (addictionType && missionDamage) {
      await supabase
        .from('addictions')
        .update({ power: Math.max(0, 100 - missionDamage) }) // simplified
        .eq('user_id', user.id)
        .eq('addiction_type', addictionType);
    }

    // Record mission
    await supabase.from('mission_history').insert({
      user_id: user.id,
      mission_id: missionId,
      xp_earned: xpGained,
      damage_dealt: missionDamage || 0,
    });

    return NextResponse.json({
      xpGained: xpGained + bonusXp,
      level: finalLevel,
      totalXp: finalTotalXp,
      allDone,
      bonusXp,
    });
  } catch (error) {
    console.error('Mission error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
