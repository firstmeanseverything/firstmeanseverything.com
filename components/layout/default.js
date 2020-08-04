import { useRouter } from 'next/router'

import Navigation from '../navigation'

function DefaultLayout({ children }) {
  const router = useRouter()

  return (
    <div>
      <Navigation />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg leading-6 font-semibold text-gray-900">
            {router.pathname === '/'
              ? 'Program'
              : router.pathname.charAt(0).toUpperCase() +
                router.pathname.slice(1)}
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-4 sm:px-0">{children}</div>
        </div>
      </main>
    </div>
  )
}

export default DefaultLayout
