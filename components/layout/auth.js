import Image from 'next/image'

import { FMEHorizontalSVG } from '@/svgs'

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 w-full sm:px-6 lg:flex-none lg:px-20 lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <FMEHorizontalSVG className="h-16 w-auto text-shark" />
          {children}
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/auth-bg.jpg"
          layout="fill"
          priority={true}
        />
      </div>
    </div>
  )
}

export const getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default AuthLayout
