import * as React from 'react'
import { useRouter } from 'next/router'

import { useAuthState } from '@/context/auth'

function useAuthenticatedPage() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!(isAuthenticating || user)) return router.replace('/signin')
  }, [isAuthenticating, user])
}

function useProtectedPage({
  path = '/',
  permittedRoles = ['basic'],
  program
} = {}) {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  const isInaccessibleProgam = user?.accessDate > program.date && !program.test

  React.useEffect(() => {
    if (!(isAuthenticating || user)) return router.replace('/signin')

    if (!(isAuthenticating || permittedRoles.includes(user?.stripeRole)))
      return router.replace(path)

    if (!(isAuthenticating || router.isPreview) && isInaccessibleProgam)
      router.replace(path)
  }, [isAuthenticating, program, router.isPreview, user])
}

function useUnauthenticatedPage() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!isAuthenticating && user) return router.replace('/')
  }, [isAuthenticating, user])
}

export { useAuthenticatedPage, useProtectedPage, useUnauthenticatedPage }
