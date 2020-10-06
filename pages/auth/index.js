import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { getLayout as getAuthLayout } from 'components/layout/auth'
import { SpinnerSVG } from 'svgs/icons'

function Auth() {
  const router = useRouter()

  useEffect(() => {
    if (!router.query.mode) router.push('/signin')

    switch (router.query.mode) {
      case 'resetPassword':
        router.push({
          pathname: '/auth/reset',
          query: { oobCode: router.query.oobCode },
        })
    }
  }, [router])

  return (
    <div className="mt-8">
      <SpinnerSVG className="animate-spin h-6 w-6" />
    </div>
  )
}

Auth.getLayout = getAuthLayout

export default Auth
