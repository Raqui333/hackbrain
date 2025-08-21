import type React from 'react';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Brain Hack - Seu Segundo Cérebro',
  description:
    'Assistente de IA que aprende com seu conteúdo e potencializa seu aprendizado',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} antialiased dark`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
