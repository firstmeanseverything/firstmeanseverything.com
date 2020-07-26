import Link from 'next/link'

import { useAuthDispatch, useAuthState } from '../../context/auth'

function DefaultLayout({ children }) {
  const { signOut } = useAuthDispatch()
  const { user } = useAuthState()

  return (
    <React.Fragment>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        {user ? (
          <li>
            <button onClick={() => signOut()}>Sign out</button>
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
