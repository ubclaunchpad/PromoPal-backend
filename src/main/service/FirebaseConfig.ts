import * as admin from 'firebase-admin';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const filepath = path.join(
  __dirname + '../../../../',
  `${process.env.FIREBASE_SERVICE_ACCOUNT_FILE!}`
);

admin.initializeApp({
  serviceAccountId: process.env.FIREBASE_SERVICE_ACCOUNT_ID,
  credential: admin.credential.cert(filepath),
});

export const firebaseAdmin = admin;
