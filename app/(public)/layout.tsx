import Footer from './components/footer'
import Navigation from './components/navigation'

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({
  children
}: PublicLayoutProps): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-grow py-12">{children}</main>
      <Footer />
    </div>
  )
}
