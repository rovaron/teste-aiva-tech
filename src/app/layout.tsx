import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Store - Sua Loja Online',
    template: '%s | Store',
  },
  description:
    'Loja online moderna com Next.js 15, TypeScript e performance otimizada',
  keywords: ['ecommerce', 'loja online', 'next.js', 'typescript', 'react'],
  authors: [{ name: 'Store Team' }],
  creator: 'Store',
  metadataBase: new URL('https://store.example.com'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://store.example.com',
    title: 'Store - Sua Loja Online',
    description:
      'Loja online moderna com Next.js 15, TypeScript e performance otimizada',
    siteName: 'Store',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Store - Sua Loja Online',
    description:
      'Loja online moderna com Next.js 15, TypeScript e performance otimizada',
    creator: '@store',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <head>
        <meta name='view-transition' content='same-origin' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background min-h-screen font-sans antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className='relative flex min-h-screen flex-col'>
            <Header />
            <main className='flex-1'>{children}</main>
            <Footer />
          </div>
          <Toaster
            position='bottom-right'
            toastOptions={{
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
