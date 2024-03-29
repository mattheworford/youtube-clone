import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { Firestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { Storage } from '@google-cloud/storage';
import { onCall } from 'firebase-functions/v2/https';
import { rawVideoBucketName } from './globals';

initializeApp();

const firestore = new Firestore();
const storage = new Storage();

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL
  };

  firestore.collection('users').doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated.'
      );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    const [url] = await bucket.file(fileName).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000
    });

    return { url, fileName };
  }
);
