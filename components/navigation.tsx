import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { UserIcon } from '@heroicons/react/solid'

import Button from '@/components/button'
import { FMEMarkSVG } from '@/svgs'
import { useAuthDispatch, useAuthState } from '@/context/auth'

export default function Navigation() {
  const { signOut } = useAuthDispatch()
  const { user } = useAuthState()
  const router = useRouter()

  const navigation = [
    {
      name: 'Competitions',
      href: '/',
      current: () =>
        router.asPath === '/' || router.asPath.includes('/competitions')
    },
    {
      name: 'Athlete Program',
      href: '/program',
      current: () => router.asPath.includes('/program')
    }
  ]
  const userNavigation = [
    {
      name: 'Account',
      href: '/account',
      current: () => router.asPath.includes('/account')
    },
    { name: 'Sign out', href: '#', current: () => false, onClick: signOut }
  ]

  return (
    <Disclosure as="nav" className="bg-shark">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href="/">
                    <FMEMarkSVG className="h-6 w-auto text-saffron" />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cx(
                          'rounded-md px-3 py-2 text-sm font-medium',
                          item.current()
                            ? 'bg-black bg-opacity-30 text-white'
                            : 'text-gray-300 hover:bg-black hover:bg-opacity-10 hover:text-white'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                {user ? (
                  <div className="flex items-center">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Open user menu</span>
                          <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                            <UserIcon className="h-full w-full text-gray-300" />
                          </span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  href={item.href}
                                  className={cx(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                  {...item}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <Button theme="gray" onClick={() => router.push('/signin')}>
                    Sign in
                  </Button>
                )}
              </div>
              <div className="-mr-2 flex sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-black hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={cx(
                    'block rounded-md px-3 py-2 text-base font-medium text-white',
                    item.current()
                      ? 'bg-black bg-opacity-30'
                      : 'text-gray-300 hover:bg-black hover:bg-opacity-10 hover:text-white'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              {user && (
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                      <UserIcon className="h-full w-full text-gray-300" />
                    </span>
                  </div>
                  <div className="ml-3">
                    {user?.displayName && (
                      <div className="text-base font-medium text-white">
                        {user.displayName}
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-400">
                      {user?.email}
                    </div>
                  </div>
                </div>
              )}
              <div className={cx('space-y-1 px-2', user ? 'mt-3' : '')}>
                {user ? (
                  userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className={cx(
                        'block rounded-md px-3 py-2 text-base font-medium text-white',
                        item.current()
                          ? 'bg-black bg-opacity-30'
                          : 'text-gray-300 hover:bg-black hover:bg-opacity-10 hover:text-white'
                      )}
                      {...item}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))
                ) : (
                  <Disclosure.Button
                    as={Link}
                    href="/signin"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-black hover:bg-opacity-10 hover:text-white"
                  >
                    Sign in
                  </Disclosure.Button>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
