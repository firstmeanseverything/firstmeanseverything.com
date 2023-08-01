'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import cx from 'classnames'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'

import FMEMarkSVG from '@/components/svgs/fme-mark'

export default function Navigation(): JSX.Element {
  const pathname = usePathname()

  const navigation: Array<{
    name: string
    href: string
    current: () => boolean
  }> = [
    {
      name: 'Competitions',
      href: '/',
      current: () =>
        (pathname === '/' || pathname?.includes('/competitions')) ?? false
    },
    {
      name: 'Athlete Program',
      href: '/program',
      current: () => pathname?.includes('/program') ?? false
    }
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
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
