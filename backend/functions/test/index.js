const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app')
const { getAuth, connectAuthEmulator } = require('firebase/auth')
const chai = require('chai');
const chaiHttp = require('chai-http');
const serviceAccount = require('../config/serviceAccountKey.json');

require('dotenv').config();

const {events_test} = require('./events')
const {candidates_test} = require('./candidates')
const {members_test} = require('./members')
const {comments_test} = require('./comments')

chai.use(chaiHttp);

// console.log(firebaseConfig)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};
  
  
const firebaseApp = initializeApp(firebaseConfig);

describe('run all tests', () => {
    const auth = getAuth(firebaseApp)
    connectAuthEmulator(auth, "http://localhost:9099")
    members_test(auth, admin);
    events_test(auth, admin);
    candidates_test(auth,admin);
    comments_test(auth, admin)
});