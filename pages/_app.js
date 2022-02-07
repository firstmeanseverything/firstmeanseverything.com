import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { DefaultSeo } from 'next-seo'

import { AuthProvider } from '@/context/auth'
import Layout from '@/components/layout'

import 'tailwindcss/tailwind.css'
import { defaultSeo } from 'next-seo.config'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)

  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <DefaultSeo {...defaultSeo} />
        <div className="min-h-screen bg-gray-200">
          {getLayout(<Component {...pageProps} />)}
        </div>
      </Elements>
    </AuthProvider>
  )
}

export default App
