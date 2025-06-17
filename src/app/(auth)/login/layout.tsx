import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Faça login em sua conta para acessar nossa plataforma.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
