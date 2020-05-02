import Link from 'next/link'

import { useAuthState, useAuthDispatch } from '../../context/auth'

function DefaultLayout({ children }) {
  const { signOut } = useAuthDispatch()
  const { isAuthenticated } = useAuthState()

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
            <Link href="#">
              <a onClick={() => signOut()}>Sign out</a>
            </Link>
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
