import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | First Means Everything',
    default: 'First Means Everything'
  },
  description: 'Functional Fitness Competitions & Programming'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-200">{children}</body>
    </html>
  )
}
