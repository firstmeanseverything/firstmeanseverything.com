import * as React from 'react'
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  linkWithPopup,
  onIdTokenChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  unlink,
  updateProfile,
  verifyPasswordResetCode
} from 'firebase/auth'
import cookie from 'js-cookie'
import format from 'date-fns/format'
import sub from 'date-fns/sub'

import { createUser, getAllUserSubscriptions } from '@/lib/db'
import { FacebookSVG } from '@/components/icons'
import firebase from '@/lib/firebase'

const AuthDispatchContext = React.createContext()
const AuthStateContext = React.createContext()

const auth = getAuth(firebase)

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null)
  const [isAuthenticating, setIsAuthenticating] = React.useState(true)

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const { providerData, token, ...user } = await parseUser(rawUser)

      createUser(user.uid, user)
      setUser({ providerData, token, ...user })

      cookie.set('first-means-everything', token, {
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

  const linkAuthProvider = (provider) =>
    linkWithPopup(auth.currentUser, provider).then((response) =>
      handleUser(response.user)
    )

  const unlinkAuthProvider = (provider) =>
    unlink(auth.currentUser, provider).then((response) =>
      handleUser(response.user)
    )

  const signInWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password).then((response) =>
      handleUser(response.user)
    )

  const signInWithProvider = (provider) =>
    signInWithPopup(auth, provider).then((response) =>
      handleUser(response.user)
    )

  const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password).then((response) =>
      handleUser(response.user)
    )

  const updateUser = (data) =>
    updateProfile(auth.currentUser, data).then(() =>
      setUser({ ...user, ...data })
    )

  const availableAuthProviders = React.useMemo(
    () => [
      {
        id: 'facebook.com',
        connected: user?.providerData?.some(
          (provider) => provider.providerId === 'facebook.com'
        ),
        icon: FacebookSVG,
        instance: new FacebookAuthProvider(),
        name: 'Facebook'
      }
    ],
    [user]
  )

  const userHasSubscription = React.useMemo(
    () => ['basic'].includes(user?.stripeRole),
    [user]
  )

  React.useEffect(() => {
    const listener = onIdTokenChanged(auth, handleUser)

    return () => listener()
  }, [])

  return (
    <AuthDispatchContext.Provider
      value={{
        confirmPasswordReset: (code, password) =>
          confirmPasswordReset(auth, code, password),
        linkAuthProvider,
        sendPasswordReset: (email) => sendPasswordResetEmail(auth, email),
        signInWithEmail,
        signInWithProvider,
        signOut: () => signOut(auth).then(() => handleUser(false)),
        signUp,
        unlinkAuthProvider,
        updateUser,
        verifyPasswordResetCode: (code) => verifyPasswordResetCode(auth, code)
      }}
    >
      <AuthStateContext.Provider
        value={{
          availableAuthProviders,
          isAuthenticating,
          user,
          userHasSubscription
        }}
      >
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

async function parseUser(user) {
  const { subscriptions } = await getAllUserSubscriptions(user.uid)

  const activeSubscription = subscriptions?.find((sub) =>
    ['active', 'trialing'].includes(sub.status)
  )

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    token: await user.getIdToken(),
    photoUrl: user.photoURL,
    providerData: user.providerData,
    stripeRole: await getStripeRole(),
    hasHadTrial: Boolean(subscriptions?.length),
    accessDate: activeSubscription
      ? format(
          sub(activeSubscription.created.toDate(), { days: 7 }),
          'yyyy-MM-dd'
        )
      : null
  }
}

async function getStripeRole() {
  await auth.currentUser.getIdToken(true)
  const decodedToken = await auth.currentUser.getIdTokenResult()

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
