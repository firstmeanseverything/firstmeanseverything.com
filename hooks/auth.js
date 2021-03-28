import * as React from 'react'
import { useRouter } from 'next/router'

import { useAuthState } from '@/context/auth'

function useAuthenticatedPage() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!(isAuthenticating || user)) router.push('/signin')
  }, [isAuthenticating, user])
}

function useProtectedPage({ permittedRoles = ['basic'] } = {}) {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!(isAuthenticating || permittedRoles.includes(user?.stripeRole)))
      router.push('/')
  }, [isAuthenticating, user])
}

function useUnauthenticatedPage() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!isAuthenticating && user) router.push('/')
  }, [isAuthenticating, user])
}

export { useAuthenticatedPage, useProtectedPage, useUnauthenticatedPage }
