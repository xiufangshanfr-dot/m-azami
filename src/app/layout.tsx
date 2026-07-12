import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PARISSA',
  description: "Site officiel de l'artiste PARISSA",
}

// Root layout: html/body are provided by each route group layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
