import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import cx from 'classnames'

import FMEMark from '../svgs/fme-mark.svg'
import Transition from './transition'
import { useAuthDispatch, useAuthState } from '../context/auth'

function Navigation() {
  const { signOut } = useAuthDispatch()
  const { user } = useAuthState()
  const router = useRouter()
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  const toggleAccountPopover = () => setAccountPopoverOpen((open) => !open)
  const toggleNavOpen = () => setNavOpen((open) => !open)

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setAccountPopoverOpen(false)
      setNavOpen(false)
    })

    return () =>
      router.events.off('routeChangeStart', () => {
        setAccountPopoverOpen(false)
        setNavOpen(false)
      })
  }, [])

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-0">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/">
                  <a>
                    <FMEMark className="h-6 text-white w-auto" />
                  </a>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline">
                  <Link href="/">
                    <a className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700">
                      Program
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <div>
                    <button
                      className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid"
                      id="user-menu"
                      aria-label="User menu"
                      aria-haspopup="true"
                      onClick={toggleAccountPopover}
                    >
                      <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    </button>
                  </div>

                  {user && (
                    <Transition
                      show={accountPopoverOpen}
                      enter="transition ease-out duration-100 transform"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75 transform"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                        <div className="rounded-md bg-white shadow-xs">
                          <div className="px-4 py-3">
                            <p className="text-sm leading-5">Signed in as</p>
                            <p className="text-sm leading-5 font-medium text-gray-900 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="border-t border-gray-100"></div>
                          <div className="py-1">
                            <Link href="/account">
                              <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Your Account
                              </a>
                            </Link>
                            <a
                              href="#"
                              onClick={signOut}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Sign out
                            </a>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  )}
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleNavOpen}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
              >
                <svg
                  className={cx('h-6 w-6', {
                    hidden: navOpen,
                    block: !navOpen,
                  })}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={cx('h-6 w-6', {
                    hidden: !navOpen,
                    block: navOpen,
                  })}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cx('border-b border-gray-700 md:hidden', {
          hidden: !navOpen,
          block: navOpen,
        })}
      >
        <div className="px-2 py-3 sm:px-3">
          <Link href="/">
            <a className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700">
              Program
            </a>
          </Link>
        </div>
        {user && (
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="ml-3">
                {user.name && (
                  <div className="text-base font-medium leading-none text-white">
                    Tom Cook
                  </div>
                )}
                <div className="mt-1 text-sm font-medium leading-none text-gray-400">
                  {user.email}
                </div>
              </div>
            </div>
            <div
              className="mt-3 px-2"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <Link href="/account">
                <a
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                  role="menuitem"
                >
                  Your Account
                </a>
              </Link>
              <button
                href="#"
                onClick={signOut}
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                role="menuitem"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
