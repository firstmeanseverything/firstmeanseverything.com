import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc
} from 'firebase/firestore'

import firebase from '@/lib/firebase'

const db = getFirestore(firebase)

const createUser = (uid, data) =>
  setDoc(doc(db, 'users', uid), { uid, ...data }, { merge: true })

const getAllUserSubscriptions = async (uid) => {
  const querySnapshot = await getDocs(
    collection(doc(db, 'users', uid), 'subscriptions')
  )

  if (querySnapshot.empty) return { subscriptions: null }

  let subscriptions = []

  querySnapshot.forEach((doc) =>
    subscriptions.push({ id: doc.id, ...doc.data() })
  )

  return {
    subscriptions
  }
}

export { createUser, getAllUserSubscriptions }
