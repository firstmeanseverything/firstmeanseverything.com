import Footer from '@/components/footer'

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow py-12">{children}</main>
      <Footer />
    </div>
  )
}
