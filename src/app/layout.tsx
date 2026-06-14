import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Internet Xavfsizligi — Bolalar uchun',
  description: "Internetda xavfsiz bo'lishni o'rgan! Bolalar uchun interaktiv ta'lim sayti.",
  keywords: ["internet xavfsizligi", "bolalar", "ta'lim", "xavfsizlik"],
  authors: [{ name: 'Internet Xavfsizligi' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
