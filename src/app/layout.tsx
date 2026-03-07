import type React from 'react'
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Sidebar from '../components/Sidebar'

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Hack Brain - Seu Segundo Cérebro',
  description: 'Assistente de IA que aprende com seu conteúdo e potencializa seu aprendizado',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} antialiased dark`}>
      <body className="font-sans">
        <main className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen">{children}</div>
        </main>
      </body>
    </html>
  )
}
