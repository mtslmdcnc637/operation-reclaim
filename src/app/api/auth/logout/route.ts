import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/auth/logout
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ message: 'Deslogado com sucesso' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
