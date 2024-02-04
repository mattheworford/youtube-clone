import {
  signInWithGoogle,
  signOut,
  onAuthStateChange
} from '../src/app/firebase/firebase';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { jest, describe, expect, it } from '@jest/globals';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    signOut: jest.fn()
  })),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  onAuthStateChanged: jest.fn()
}));

describe('Firebase services', () => {
  it('should sign in with Google', async () => {
    await signInWithGoogle();
    expect(GoogleAuthProvider).toHaveBeenCalled();
    expect(signInWithPopup).toHaveBeenCalled();
  });

  it('should sign out', async () => {
    await signOut();
    expect(getAuth).toHaveBeenCalled();
  });

  it('should call onAuthStateChanged when onAuthStateChange is called', () => {
    const callback = jest.fn();
    onAuthStateChange(callback);
    expect(onAuthStateChanged).toHaveBeenCalledWith(
      expect.anything(),
      callback
    );
  });
});
