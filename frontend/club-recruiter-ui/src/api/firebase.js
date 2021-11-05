import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithPopup, GoogleAuthProvider,
} from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

const db = getFirestore();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const logout = () => {
  console.log('Logging out');
  auth.signOut();
};

/*
const eventCandidate = {
  eventCode: 'asdf',
  email: 'em',
  name: 'nama',
  phoneNumber: '123456789',
  biography: 'I am happy',
  resumeLink: 'none',
};
*/

// TODO: Check whether (eventCode, email) pair exists in database
const addEventCandidate = async (
  eventCandidate,
) => {
  try {
    const docRef = await addDoc(collection(db, 'candidates'), {
      eventCode: eventCandidate.eventCode,
      email: eventCandidate.email,
      name: eventCandidate.name,
      phoneNumber: eventCandidate.phoneNumber,
      biography: eventCandidate.biography,
      applicationStatus: 'pending',
      resumeLink: eventCandidate.resumeLink,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export {
  auth,
  signInWithGoogle,
  logout,
  addEventCandidate,
};
