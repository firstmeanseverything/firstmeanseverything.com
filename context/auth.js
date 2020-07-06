import { createContext, useContext, useEffect, useReducer } from 'react'
import firebase from '../lib/firebase'

const AuthStateContext = createContext()

function reducer(state, { payload, type }) {
  switch (type) {
    case 'AUTHENTICATE':
      return { ...state, ...payload, authState: 'authenticated' }
    case 'UNAUTHENTICATE':
      return { ...state, ...initialState, authState: 'unauthenticated' }
    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

const initialState = {
  user: null,
  authState: 'loading',
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          dispatch({ type: 'AUTHENTICATE', payload: { user } })
        } else dispatch({ type: 'UNAUTHENTICATE' })
      } catch (error) {
        console.log(error)
      }
    })

    return () => listener()
  }, [])

  const isAuthenticated = state.authState === 'authenticated'
  const isAuthLoading = state.authState === 'loading'

  return (
    <AuthStateContext.Provider
      value={{ isAuthenticated, isAuthLoading, ...state }}
    >
      {children}
    </AuthStateContext.Provider>
  )
}

function useAuthState() {
  const context = useContext(AuthStateContext)

  if (context === undefined)
    throw new Error('useAuthState must be used within an AuthProvider')

  return context
}

export { AuthProvider, useAuthState }
