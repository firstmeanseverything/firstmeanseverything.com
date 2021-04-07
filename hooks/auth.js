import * as React from 'react'
import { useRouter } from 'next/router'

import { useAuthState } from '@/context/auth'

function useAccessiblePage({ programDate }) {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    const isFutureProgram = new Date(programDate) > new Date()
    const isInaccessibleProgam = user?.accessDate > new Date(programDate)

    if (
      !(isAuthenticating || router.isPreview) &&
      (isFutureProgram || isInaccessibleProgam)
    )
      router.push('/')
  }, [isAuthenticating, programDate, router.isPreview, user])
}

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

export {
  useAccessiblePage,
  useAuthenticatedPage,
  useProtectedPage,
  useUnauthenticatedPage
}
