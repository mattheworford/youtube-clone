import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC3AFlzqZg8VyHnA4J2j8Ifg6GUoTFr32o',
  authDomain: 'clone-403ca.firebaseapp.com',
  projectId: 'clone-403ca',
  appId: '1:567761675030:web:e35a3753b6f7bacf38e637'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function signOut() {
  return auth.signOut();
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
