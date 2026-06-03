import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spice Garden Kitchen Menu',
  description:
    'A Petpooja-style digital restaurant menu built with Next.js and TypeScript.',
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
