import { NextResponse } from 'next/server'
import { getUserFromAPI } from '@/actions/auth'

export async function GET() {
  try {
    const user = await getUserFromAPI()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}