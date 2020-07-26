import { createContext, useContext, useEffect, useState } from 'react'
import cookie from 'js-cookie'

import firebase from '../lib/firebase'
import { createUser } from '../lib/db'

const AuthDispatchContext = createContext()
const AuthStateContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const { token, ...user } = await parseUser(rawUser)

      createUser(user.uid, user)
      setUser({ token, ...user })

      cookie.set('first-means-everything', true, {
        expires: 1,
      })

      return { token, ...user }
    } else {
      setUser(false)
      cookie.remove('first-means-everything')

      return false
    }
  }

  const signIn = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => handleUser(response.user))
  }

  const signOut = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false))
  }

  const signUp = (email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => handleUser(response.user))
  }

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(handleUser)

    return () => listener()
  }, [])

  return (
    <AuthDispatchContext.Provider value={{ signIn, signOut, signUp }}>
      <AuthStateContext.Provider value={{ user }}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

async function parseUser(user) {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    token: user.xa,
    photoUrl: user.photoURL,
    stripeRole: await getStripeRole(),
  }
}

async function getStripeRole() {
  await firebase.auth().currentUser.getIdToken(true)
  const decodedToken = await firebase.auth().currentUser.getIdTokenResult()

  return decodedToken.claims.stripeRole || 'free'
}

function useAuthDispatch() {
  const context = useContext(AuthDispatchContext)

  if (context === undefined)
    throw new Error('useAuthDispatch must be used within an AuthProvider')

  return context
}

function useAuthState() {
  const context = useContext(AuthStateContext)

  if (context === undefined)
    throw new Error('useAuthState must be used within an AuthProvider')

  return context
}

export { AuthProvider, useAuthDispatch, useAuthState }
