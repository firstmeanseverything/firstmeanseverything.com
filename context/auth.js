import * as React from 'react'
import cookie from 'js-cookie'

import firebase from 'lib/firebase'
import { createUser } from 'lib/db'

const AuthDispatchContext = React.createContext()
const AuthStateContext = React.createContext()

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null)
  const [isAuthenticating, setIsAuthenticating] = React.useState(true)

  const confirmPasswordReset = (code, password) => {
    return firebase.auth().confirmPasswordReset(code, password)
  }

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const { token, ...user } = await parseUser(rawUser)

      createUser(user.uid, user)
      setUser({ token, ...user })

      cookie.set('first-means-everything', true, {
        expires: 1
      })

      setIsAuthenticating(false)

      return { token, ...user }
    } else {
      setUser(false)
      cookie.remove('first-means-everything')

      setIsAuthenticating(false)

      return false
    }
  }

  const sendPasswordReset = (email) => {
    return firebase.auth().sendPasswordResetEmail(email)
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

  const updateUser = (data) => {
    return firebase
      .auth()
      .currentUser.updateProfile(data)
      .then(() => setUser({ ...user, ...data }))
  }

  const verifyPasswordResetCode = (code) => {
    return firebase.auth().verifyPasswordResetCode(code)
  }

  React.useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(handleUser)

    return () => listener()
  }, [])

  return (
    <AuthDispatchContext.Provider
      value={{
        confirmPasswordReset,
        sendPasswordReset,
        signIn,
        signOut,
        signUp,
        updateUser,
        verifyPasswordResetCode
      }}
    >
      <AuthStateContext.Provider value={{ isAuthenticating, user }}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

async function parseUser(user) {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    token: user.xa,
    photoUrl: user.photoURL,
    stripeRole: await getStripeRole()
  }
}

async function getStripeRole() {
  await firebase.auth().currentUser.getIdToken(true)
  const decodedToken = await firebase.auth().currentUser.getIdTokenResult()

  return decodedToken.claims.stripeRole || 'free'
}

function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext)

  if (context === undefined)
    throw new Error('useAuthDispatch must be used within an AuthProvider')

  return context
}

function useAuthState() {
  const context = React.useContext(AuthStateContext)

  if (context === undefined)
    throw new Error('useAuthState must be used within an AuthProvider')

  return context
}

export { AuthProvider, useAuthDispatch, useAuthState }
