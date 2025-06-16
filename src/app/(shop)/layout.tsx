import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Loja',
    default: 'Loja',
  },
  description: 'Descubra nossos produtos incríveis com a melhor qualidade e preços.',
}

interface ShopLayoutProps {
  children: React.ReactNode
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <>
      {children}
    </>
  )
}