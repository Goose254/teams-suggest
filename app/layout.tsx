import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Teams Suggest — Générateur de suggestions absurdes',
  description:
    "L'IA qui sait ce que tu veux dire… ou pas. Génère des suggestions Microsoft Teams hilarantes et partage-les avec tes collègues.",
  openGraph: {
    title: 'Teams Suggest 😂',
    description: 'Parce que les suggestions Teams sont un art incompris.',
    type: 'website',
    siteName: 'Teams Suggest',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teams Suggest 😂',
    description: 'Parce que les suggestions Teams sont un art incompris.',
  },
  robots: 'index, follow',
}

export const viewport: Viewport = {
  themeColor: '#0d0d0d',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`dark ${outfit.variable}`}>
      <body className="min-h-screen antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}
