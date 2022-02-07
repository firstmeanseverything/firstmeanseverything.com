import * as React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import cx from 'classnames'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { UserIcon } from '@heroicons/react/solid'

import { FMEMarkSVG } from '@/svgs'
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
    <nav className="bg-shark">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="border-b border-gray-700">
          <div className="flex h-16 items-center justify-between px-4 sm:px-0">
            <div className="flex items-center">
              <div className="shrink-0">
                <Link href="/">
                  <a>
                    <FMEMarkSVG className="h-6 w-auto text-saffron" />
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
                                'rounded-md px-3 py-2 text-sm font-medium focus:bg-gray-700 focus:text-white focus:outline-none',
                                {
                                  'bg-gray-900 text-white': isActive,
                                  'text-gray-300 hover:bg-gray-700 hover:text-white':
                                    !isActive
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
                <div className="relative ml-3">
                  {user && (
                    <Menu>
                      {({ open }) => (
                        <React.Fragment>
                          <Menu.Button
                            id="test"
                            className="focus:shadow-solid flex max-w-xs items-center rounded-full text-sm text-white focus:outline-none"
                          >
                            <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                              <UserIcon className="h-full w-full text-gray-300" />
                            </span>
                          </Menu.Button>
                          <Transition
                            show={open}
                            enter="transition ease-out duration-100"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y
                            divide-gray-100 rounded-md border border-gray-200
                            bg-white shadow-lg outline-none"
                            >
                              <div className="px-4 py-3">
                                <p className="text-sm leading-5">
                                  Signed in as
                                </p>
                                <p className="truncate text-sm font-medium leading-5 text-gray-900">
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
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:outline-none"
              >
                {navOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
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
                      'block rounded-md px-3 py-2 text-base font-medium focus:bg-gray-700 focus:text-white focus:outline-none',
                      {
                        'bg-gray-900 text-white': isActive,
                        'text-gray-300 hover:bg-gray-700 hover:text-white':
                          !isActive
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
            className={cx('border-gray-700 pt-4 pb-3', {
              'border-t': primaryLinks.length
            })}
          >
            <div className="flex items-center px-5">
              <div className="shrink-0">
                <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                  <UserIcon className="h-full w-full text-gray-300" />
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
              className="mt-3 space-y-1 px-2"
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
                        'block rounded-md px-3 py-2 text-base font-medium focus:bg-gray-700 focus:text-white focus:outline-none',
                        {
                          'bg-gray-900 text-white': isActive,
                          'text-gray-400 hover:bg-gray-700 hover:text-white':
                            !isActive
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
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:outline-none"
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
