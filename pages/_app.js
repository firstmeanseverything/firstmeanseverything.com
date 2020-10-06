import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { AuthProvider } from 'context/auth'
import Layout from 'components/layout'

import 'styles/index.css'

function App({ Component, pageProps }) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  )

  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)

  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        {getLayout(<Component {...pageProps} />)}
      </Elements>
    </AuthProvider>
  )
}

export default App
