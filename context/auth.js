import { createContext, useContext, useEffect, useReducer } from 'react'
import userbase from 'userbase-js'

const AuthDispatchContext = createContext()
const AuthStateContext = createContext()

function authReducer(state, { payload, type }) {
  switch (type) {
    case 'AUTHENTICATE':
      return { ...state, ...payload, isAuthenticated: true }
    case 'UNAUTHENTICATE':
      return { ...state, ...initialState }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const initialState = {
  isAuthenticated: false,
  user: null,
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initUserbase = async () => {
      try {
        const { user } = await userbase.init({
          appId: process.env.USERBASE_APP_ID,
        })

        if (user) dispatch({ type: 'AUTHENTICATE', payload: { user } })
      } catch (err) {
        console.log(err)
      }
    }

    initUserbase()
  }, [])

  const signIn = async (data) => {
    const user = await userbase.signIn({ ...data, rememberMe: 'local' })

    dispatch({ type: 'AUTHENTICATE', payload: { user } })
  }

  const signOut = async () => {
    await userbase.signOut()

    dispatch({ type: 'UNAUTHENTICATE' })
  }

  const signUp = async (data) => {
    const user = await userbase.signUp({ ...data, rememberMe: 'local' })

    dispatch({ type: 'AUTHENTICATE', payload: { user } })
  }

  return (
    <AuthStateContext.Provider value={{ ...state }}>
      <AuthDispatchContext.Provider
        value={{ dispatch, signIn, signOut, signUp }}
      >
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

function useAuthState() {
  const context = useContext(AuthStateContext)

  if (context === undefined)
    throw new Error('useAuthState must be used within an AuthProvider')

  return context
}

function useAuthDispatch() {
  const context = useContext(AuthDispatchContext)

  if (context === undefined)
    throw new Error('useAuthDispatch must be used within an AuthProvider')

  return context
}

export { AuthProvider, useAuthDispatch, useAuthState }
