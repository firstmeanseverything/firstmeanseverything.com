import * as React from 'react'
import cookie from 'js-cookie'
import sub from 'date-fns/sub'

import firebase from '@/lib/firebase'
import { createUser, getLatestActiveSubscription } from '@/lib/db'

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
      const { providerData, token, ...user } = await parseUser(rawUser)

      createUser(user.uid, user)
      setUser({ providerData, token, ...user })

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

  const linkAuthProvider = (provider) => {
    return firebase
      .auth()
      .currentUser.linkWithPopup(provider)
      .then((response) => handleUser(response.user))
  }

  const unlinkAuthProvider = (provider) => {
    return firebase
      .auth()
      .currentUser.unlink(provider)
      .then((response) => handleUser(response.user))
  }

  const sendPasswordReset = (email) => {
    return firebase.auth().sendPasswordResetEmail(email)
  }

  const signInWithEmail = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => handleUser(response.user))
  }

  const signInWithFacebook = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
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
        linkAuthProvider,
        sendPasswordReset,
        signInWithEmail,
        signInWithFacebook,
        signOut,
        signUp,
        unlinkAuthProvider,
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
  const { subscription } = await getLatestActiveSubscription(user.uid)

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    token: await user.getIdToken(),
    photoUrl: user.photoURL,
    providerData: user.providerData,
    stripeRole: await getStripeRole(),
    accessDate: subscription
      ? sub(subscription.created.toDate(), { days: 7 })
      : null
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
