import { useRouter } from 'next/router'

import Footer from '@/components/footer'
import Navigation from '@/components/navigation'

function Layout({ children }) {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col">
      {router.isPreview ? (
        <div className="relative bg-indigo-600">
          <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
            <div className="pr-16 sm:px-16 sm:text-center">
              <p className="font-medium text-white">
                <span className="md:hidden">
                  You're currently in Preview Mode, viewing draft content.
                </span>
                <span className="block sm:ml-2 sm:inline-block">
                  <a
                    href="/api/exit-preview"
                    className="font-bold text-white underline"
                  >
                    {' '}
                    Exit Preview Mode <span aria-hidden="true">&rarr;</span>
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
      <Navigation />
      <main className="flex-grow py-12">{children}</main>
      <Footer />
    </div>
  )
}

export const getLayout = (page) => <Layout>{page}</Layout>

export default Layout
