import firebase from './firebase'

const createUser = (uid, data) => {
  return firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .set({ uid, ...data }, { merge: true })
}

export { createUser }
