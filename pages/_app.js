import { useEffect } from 'react'
import userbase from 'userbase-js'

import '../styles/index.css'

function App({ Component, pageProps }) {
  useEffect(() => {
    const initUserbase = async () => {
      try {
        await userbase.init({
          appId: process.env.USERBASE_APP_ID,
        })
      } catch (err) {
        console.log(err)
      }
    }

    initUserbase()
  }, [])

  return <Component {...pageProps} />
}

export default App
