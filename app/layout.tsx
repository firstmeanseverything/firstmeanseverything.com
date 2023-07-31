import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | First Means Everything',
    default: 'First Means Everything'
  },
  description: 'Functional Fitness Competitions & Programming'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-200">{children}</body>
    </html>
  )
}
