import { useRouter } from 'next/router'

import Navigation from '@/components/navigation'

function Layout({ children }) {
  const router = useRouter()

  return (
    <div>
      {router.isPreview ? (
        <div className="relative bg-indigo-600">
          <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div className="pr-16 sm:text-center sm:px-16">
              <p className="font-medium text-white">
                <span className="md:hidden">
                  You're currently in Preview Mode, viewing draft content.
                </span>
                <span className="block sm:ml-2 sm:inline-block">
                  <a
                    href="/api/exit-preview"
                    className="text-white font-bold underline"
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
      {children}
    </div>
  )
}

export const getLayout = (page) => <Layout>{page}</Layout>

export default Layout
