import * as React from 'react'
import { useRouter } from 'next/router'

import { useAuthState } from '@/context/auth'

function useAccessiblePage({ program } = {}) {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    const isInaccessibleProgam =
      user?.accessDate > program.date && !program.test

    if (!(isAuthenticating || router.isPreview) && isInaccessibleProgam)
      router.replace('/')
  }, [isAuthenticating, program, router.isPreview, user])
}

function useAuthenticatedPage() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!(isAuthenticating || user)) router.replace('/signin')
  }, [isAuthenticating, user])
}

function useProtectedPage({ permittedRoles = ['basic'] } = {}) {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!(isAuthenticating || permittedRoles.includes(user?.stripeRole)))
      router.replace('/')
  }, [isAuthenticating, user])
}

function useUnauthenticatedPage() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!isAuthenticating && user) router.replace('/')
  }, [isAuthenticating, user])
}

export {
  useAccessiblePage,
  useAuthenticatedPage,
  useProtectedPage,
  useUnauthenticatedPage
}
