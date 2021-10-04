/* eslint-disable eol-last */
/* eslint-disable indent */
// https://github.com/soumak77/firebase-mock/blob/master/tutorials/integration/setup.md
import {
  createUserWEP,
  signInWithGoogle,
  signOut,
  singInWEP,
} from '../src/firebase/auth.js';

// Configurando firebase-mock
const firebasemock = require('firebase-mock');

// const mockauth = new firebasemock.MockAuthentication();
const mockauth = new firebasemock.MockFirebase();
mockauth.autoFlush();

// De manera global, firebase será reemp. por MockFirebaseSdk
global.firebase = firebasemock.MockFirebaseSdk(
  () => null, // usar null si cód. no es Autenticación, firestore, storage o messaging
  () => mockauth,
);

describe('Function createUserWEP', () => {
  it('User should create an account with e-mail and password', () =>
    // eslint-disable-next-line implicit-arrow-linebreak
    createUserWEP('abc@gmail.com', '12345678a#')
    .then((user) => {
      expect(user.email).toBe('abc@gmail.com');
    }));
});

describe('Function signInWithGoogle', () => {
  it('User should log in with Google', () => {
    signInWithGoogle().then((user) => {
      expect(user.isAnonymus).toBe(false);
    });
  });
});

describe('Function signOut', () => {
  it('User should log out session', () => {
    signOut().then((user) => {
      expect(user.i).toBe(null);
    });
  });
});

describe('Function singInWEP', () => {
  it('User should log in with e-mail and password', () => singInWEP('nanita462@gmail.com', '12345678a#')
    .then((user) => {
      expect(user.email).toBe('nanita462@gmail.com');
    }));
});