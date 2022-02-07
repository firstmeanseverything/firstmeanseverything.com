import * as React from 'react'
import { useRouter } from 'next/router'

import { getLayout as getAuthLayout } from '@/components/layout/auth'
import { SpinnerSVG } from '@/icons'

function Auth() {
  const router = useRouter()

  React.useEffect(() => {
    if (!router.query.mode) router.push('/signin')

    switch (router.query.mode) {
      case 'resetPassword':
        router.push({
          pathname: '/auth/reset',
          query: { oobCode: router.query.oobCode }
        })
    }
  }, [router])

  return (
    <div className="mt-8">
      <SpinnerSVG className="h-6 w-6 animate-spin" />
    </div>
  )
}

Auth.getLayout = getAuthLayout

export default Auth
