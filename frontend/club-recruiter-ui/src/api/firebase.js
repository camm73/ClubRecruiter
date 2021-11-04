import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

const firebaseApp = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const auth = getAuth(firebaseApp);

// Generic provider sign in
const providerSignIn = async (provider) => {
  try {
    const response = await signInWithPopup(auth, provider);
    const { user } = response;
    return user;
  } catch (err) {
    console.log(err);
    alert('Sign in failed!');
    return null;
  }
};

// "Sign in With X" support
const googleSignIn = providerSignIn(googleProvider);
const facebookSignIn = providerSignIn(facebookProvider);

const logout = () => {
  auth.signOut();
};

export {
  auth,
  googleSignIn,
  facebookSignIn,
  logout,
};
