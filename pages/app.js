import { useEffect } from 'react'
import { useRouter } from 'next/router'

import ProgramList from '../components/program-list'
import { useAuthState } from '../context/auth'

function App() {
  const { isAuthenticated, isAuthLoading } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) router.push('/signin')
  }, [isAuthenticated, isAuthLoading])

  return <ProgramList />
}

export default App
