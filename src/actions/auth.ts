'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const API_BASE = 'https://api.escuelajs.co/api/v1';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

export async function login(formData: FormData): Promise<{ error?: string; success?: boolean } | never> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.errors.map(err => err.message).join(', ');
    return { error: `Dados inválidos: ${errors}` };
  }

  try {
    // Fazer login na API real
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      switch (response.status) {
        case 401:
          return { error: 'Email ou senha incorretos. Verifique suas credenciais.' };
        case 400:
          return { error: errorData?.message || 'Dados de login inválidos.' };
        case 429:
          return { error: 'Muitas tentativas de login. Tente novamente em alguns minutos.' };
        case 500:
          return { error: 'Erro interno do servidor. Tente novamente mais tarde.' };
        default:
          return { error: `Erro no login (${response.status}). Tente novamente.` };
      }
    }

    const tokens: LoginResponse = await response.json();

    if (!tokens.access_token || !tokens.refresh_token) {
      return { error: 'Resposta inválida do servidor. Tente novamente.' };
    }

    // Buscar dados do usuário usando o access token
    const userResponse = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return { error: 'Erro ao buscar dados do usuário. Tente fazer login novamente.' };
    }

    await userResponse.json(); // Validar que a resposta é válida

    // Salvar apenas os tokens em cookies HTTPOnly
    const cookieStore = await cookies();
    
    cookieStore.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });
    
    cookieStore.set('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });

    return { success: true };

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { error: 'Erro de conexão. Verifique sua internet e tente novamente.' };
    }
    
    return { error: 'Erro inesperado durante o login. Tente novamente.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  
  // Remover todos os cookies de autenticação
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
  
  redirect('/login');
}

export async function getUserFromAPI(): Promise<User | null> {
  const accessToken = await getAccessToken();
  
  if (!accessToken) return null;
  
  try {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const user: User = await response.json();
    return user;
  } catch {
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  return token?.value || null;
}

export async function refreshAccessToken(): Promise<boolean> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token');
  
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: refreshToken.value,
      }),
    });

    if (!response.ok) {
      // Se o refresh token é inválido, fazer logout
      await logout();
      return false;
    }

    const tokens: LoginResponse = await response.json();

    // Atualizar tokens
    cookieStore.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 20,
      sameSite: 'lax',
    });

    cookieStore.set('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 10,
      sameSite: 'lax',
    });

    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    await logout();
    return false;
  }
}