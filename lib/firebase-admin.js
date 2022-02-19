import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app'

const admin = !getApps().length
  ? initializeApp({
      credential: cert({
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    })
  : getApp()

export default admin
