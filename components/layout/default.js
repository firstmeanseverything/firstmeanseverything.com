import Link from 'next/link'

import firebase from '../../lib/firebase'
import { useAuthState } from '../../context/auth'

function DefaultLayout({ children }) {
  const { isAuthenticated } = useAuthState()

  const signOut = async () => await firebase.auth().signOut()

  return (
    <React.Fragment>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        {isAuthenticated ? (
          <li>
            <button onClick={signOut}>Sign out</button>
          </li>
        ) : (
          <React.Fragment>
            <li>
              <Link href="/signin">
                <a>Sign in</a>
              </Link>
            </li>
            <li>
              <Link href="/signup">
                <a>Sign up</a>
              </Link>
            </li>
          </React.Fragment>
        )}
      </ul>
      {children}
    </React.Fragment>
  )
}

export default DefaultLayout
