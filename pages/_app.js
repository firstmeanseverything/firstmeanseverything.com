import { AuthProvider } from '../context/auth'
import Layout from '../components/layout'

import '../styles/index.css'

function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default App
