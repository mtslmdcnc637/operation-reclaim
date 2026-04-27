import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { email, password, codeName } = await request.json();

    if (!email || !password || !codeName) {
      return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha mínima de 6 caracteres' }, { status: 400 });
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          code_name: codeName,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
      message: 'Conta criada com sucesso',
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
