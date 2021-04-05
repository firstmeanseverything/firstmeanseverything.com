import * as React from 'react'
import { useRouter } from 'next/router'

import { useAuthState } from '@/context/auth'

function useAccessiblePage({ programDate }) {
  const { user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    const isFutureProgram = new Date(programDate) > new Date()
    const isInaccessibleProgam = user?.accessDate > new Date(programDate)

    if (isFutureProgram || isInaccessibleProgam) router.push('/')
  }, [programDate, user])
}

function useAuthenticatedPage() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!(isAuthenticating || user)) router.push('/signin')
  }, [isAuthenticating, user])
}

function useProtectedPage({ permittedRoles = ['basic'] } = {}) {
  const { user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!permittedRoles.includes(user?.stripeRole)) router.push('/')
  }, [user])
}

function useUnauthenticatedPage() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    if (!isAuthenticating && user) router.push('/')
  }, [isAuthenticating, user])
}

export {
  useAccessiblePage,
  useAuthenticatedPage,
  useProtectedPage,
  useUnauthenticatedPage
}
