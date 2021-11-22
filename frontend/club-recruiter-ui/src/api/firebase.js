import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithPopup, GoogleAuthProvider,
} from 'firebase/auth';
import {
  getStorage, ref, uploadBytes, getDownloadURL,
} from 'firebase/storage';
import sha1 from 'crypto-js/sha1';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const cloudFunctionEndpoint = 'https://us-central1-recruitme-4b479.cloudfunctions.net/app';
// Endpoint for local testing
// const cloudFunctionEndpoint = 'http://localhost:5001/recruitme-4b479/us-central1/app';

const firebaseApp = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

const storage = getStorage();

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

const uploadFile = async (file, folderName) => {
  const fileExtension = file.name.split('.').pop();
  const fileHash = sha1(file.name + new Date().getTime().toString());
  const fileName = `${fileHash}.${fileExtension}`;
  const fileRef = ref(storage, `${folderName}/${fileName}`);
  const snapshot = await uploadBytes(fileRef, file);
  console.log(snapshot);
  return fileName;
};

const getFileLink = async (file, folderName) => {
  const refName = `${folderName}/${file}`;
  const url = await getDownloadURL(ref(storage, refName));
  return url;
};

const getResumeLink = async (file) => getFileLink(file, 'resume');

const getEventCoverPhotoLink = async (file) => getFileLink(file, 'eventCoverPhoto');

export {
  auth,
  signInWithGoogle,
  logout,
  uploadFile,
  cloudFunctionEndpoint,
  getResumeLink,
  getEventCoverPhotoLink,
};
