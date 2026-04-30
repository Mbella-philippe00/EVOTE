import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'E-Vote Cameroun — Plateforme Électorale Nationale',
  description: 'Système de gestion électorale sécurisé pour la République du Cameroun',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
