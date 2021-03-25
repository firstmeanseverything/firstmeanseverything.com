import * as React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import cx from 'classnames'

import { APMarkSVG } from '@/svgs'
import { useAuthDispatch, useAuthState } from '@/context/auth'

function Navigation() {
  const { signOut } = useAuthDispatch()
  const { user } = useAuthState()
  const router = useRouter()
  const [navOpen, setNavOpen] = React.useState(false)

  const toggleNavOpen = () => setNavOpen((open) => !open)

  const primaryLinks = []

  const secondaryLinks = [
    {
      href: '/account',
      label: 'Your Account'
    }
  ]

  const MenuLink = ({ children, href, ...rest }) => (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  )

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-0">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/">
                  <a>
                    <APMarkSVG className="h-8 text-white w-auto" />
                  </a>
                </Link>
              </div>
              {primaryLinks.length ? (
                <React.Fragment>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline">
                      {primaryLinks.map((link, index) => {
                        const isActive = router.pathname.startsWith(link.href)

                        return (
                          <Link key={index} href={link.href}>
                            <a
                              className={cx(
                                'px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-gray-700',
                                {
                                  'text-white bg-gray-900': isActive,
                                  'text-gray-300 hover:text-white hover:bg-gray-700': !isActive
                                }
                              )}
                            >
                              {link.label}
                            </a>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </React.Fragment>
              ) : null}
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  {user && (
                    <Menu>
                      {({ open }) => (
                        <React.Fragment>
                          <Menu.Button
                            id="test"
                            className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid"
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
                          </Menu.Button>
                          <Transition
                            show={open}
                            enter="transition ease-out duration-100 transform"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-75 transform"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="origin-top-right absolute right-0 mt-2 w-56 bg-white
                            border border-gray-200 divide-y divide-gray-100
                            rounded-md shadow-lg outline-none"
                            >
                              <div className="px-4 py-3">
                                <p className="text-sm leading-5">
                                  Signed in as
                                </p>
                                <p className="text-sm leading-5 font-medium text-gray-900 truncate">
                                  {user.email}
                                </p>
                              </div>
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <MenuLink
                                      href="/account"
                                      className={cx(
                                        'block px-4 py-2 text-sm hover:bg-gray-100',
                                        {
                                          'bg-gray-100 text-gray-900': active,
                                          'text-gray-700': !active
                                        }
                                      )}
                                    >
                                      Your Account
                                    </MenuLink>
                                  )}
                                </Menu.Item>
                              </div>
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      onClick={signOut}
                                      className={cx(
                                        'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100',
                                        {
                                          'bg-gray-100 text-gray-900': active,
                                          'text-gray-700': !active
                                        }
                                      )}
                                    >
                                      Sign out
                                    </a>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </React.Fragment>
                      )}
                    </Menu>
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
                    block: !navOpen
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
                    block: navOpen
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
          block: navOpen
        })}
      >
        {primaryLinks.length ? (
          <div className="px-2 py-3 sm:px-3">
            {primaryLinks.map((link, index) => {
              const isActive = router.pathname.startsWith(link.href)

              return (
                <Link key={index} href={link.href}>
                  <a
                    className={cx(
                      'block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:text-white focus:bg-gray-700',
                      {
                        'text-white bg-gray-900': isActive,
                        'text-gray-300 hover:text-white hover:bg-gray-700': !isActive
                      }
                    )}
                  >
                    {link.label}
                  </a>
                </Link>
              )
            })}
          </div>
        ) : null}
        {user && (
          <div
            className={cx('pt-4 pb-3 border-gray-700', {
              'border-t': primaryLinks.length
            })}
          >
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
                {user.displayName && (
                  <div className="text-base font-medium leading-none text-white">
                    {user.displayName}
                  </div>
                )}
                <div className="mt-1 text-sm font-medium leading-none text-gray-400">
                  {user.email}
                </div>
              </div>
            </div>
            <div
              className="mt-3 px-2 space-y-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              {secondaryLinks.map((link, index) => {
                const isActive = router.pathname.startsWith(link.href)

                return (
                  <Link key={index} href={link.href}>
                    <a
                      className={cx(
                        'block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:text-white focus:bg-gray-700',
                        {
                          'text-white bg-gray-900': isActive,
                          'text-gray-400 hover:text-white hover:bg-gray-700': !isActive
                        }
                      )}
                      role="menuitem"
                    >
                      {link.label}
                    </a>
                  </Link>
                )
              })}

              <a
                href="#"
                onClick={signOut}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                role="menuitem"
              >
                Sign out
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
