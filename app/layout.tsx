import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GT Coaching — Gazon Tropical',
  description: "Outil de suivi de coaching S.M.A.R.T. de l'équipe Gazon Tropical",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900">{children}</body>
    </html>
  )
}
