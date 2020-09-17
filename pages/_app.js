import { useRouter } from 'next/router'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { AuthProvider } from '../context/auth'
import { AuthLayout, DefaultLayout } from '../components/layout'

import '../styles/index.css'

function App({ Component, pageProps }) {
  const router = useRouter()

  const isAuthPath = ['/forgot', '/signin', '/signup'].includes(router.pathname)

  const Layout = isAuthPath ? AuthLayout : DefaultLayout

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  )

  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Elements>
    </AuthProvider>
  )
}

export default App
