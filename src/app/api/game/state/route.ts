import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/game/state — Get full game state
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get game state
    const { data: gameState } = await supabase
      .from('game_states')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get addictions
    const { data: addictions } = await supabase
      .from('addictions')
      .select('*')
      .eq('user_id', user.id);

    return NextResponse.json({
      profile,
      gameState,
      addictions: addictions || [],
    });
  } catch (error) {
    console.error('State error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
