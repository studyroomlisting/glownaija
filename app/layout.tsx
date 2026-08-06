export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'GlowNaija — Nigerian & Afro-Caribbean Beauty', template: '%s | GlowNaija' },
  description: 'Find and book the best Nigerian and Afro-Caribbean hair and beauty salons across the UK.',
  keywords: ['afro hair', 'nigerian salon', 'black hair', 'knotless braids', 'uk beauty'],
  authors: [{ name: 'Nexova Technologies Ltd' }],
  manifest: '/manifest.json',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  openGraph: {
    siteName: 'GlowNaija',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/assets/images/og-default.svg', width: 1200, height: 630, alt: 'GlowNaija' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  )
}
