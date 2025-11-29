import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'Kids Reading Word Helper',
  description: 'A vocabulary learning tool for children reading English books',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navigation />
        {children}
      </body>
    </html>
  )
}