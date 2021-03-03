import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { auth } from 'firebase-admin/lib/auth';
import Auth = auth.Auth;
dotenv.config();

export function initFirebaseAdmin(): Auth {
  admin.initializeApp({
    serviceAccountId: process.env.FIREBASE_SERVICE_ACCOUNT_ID,
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
  return admin.auth();
}
