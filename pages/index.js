import { useAuthState } from '../context/auth'

function Index() {
  const { isAuthenticated } = useAuthState()

  if (!isAuthenticated) return 'Hello, stranger!'

  return 'Welcome back'
}

export default Index
