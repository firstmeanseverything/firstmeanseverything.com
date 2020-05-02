import { useRouter } from 'next/router'

import { AuthProvider } from '../context/auth'
import { AuthLayout, DefaultLayout } from '../components/layout'

import '../styles/index.css'

function App({ Component, pageProps }) {
  const router = useRouter()

  const isAuthPath = ['/signin', '/signup'].includes(router.pathname)

  const Layout = isAuthPath ? AuthLayout : DefaultLayout

  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default App
