import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Store',
    default: 'Store',
  },
  description: 'Páginas institucionais e de marketing da Store.',
}

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return <>{children}</>
}
