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
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const logout = () => {
  console.log('Logging out');
  auth.signOut();
};

// TODO: Check whether (eventCode, email) pair exists in database
const addEventCandidate = async (
  eventCandidate,
) => {
  try {
    const {
      eventCode, email, name, phoneNumber, biography, resumeLink,
    } = eventCandidate;
    const docRef = await addDoc(collection(db, 'candidates'), {
      eventCode,
      email,
      name,
      phoneNumber,
      biography,
      applicationStatus: 'pending',
      resumeLink,
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
