import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

export function initFirebaseAdmin() {
  admin.initializeApp({
    serviceAccountId: process.env.FIREBASE_SERVICE_ACCOUNT_ID,
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
  return admin;
}
