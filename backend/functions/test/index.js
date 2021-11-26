const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app')
const { getAuth, signInWithCustomToken, connectAuthEmulator } = require('firebase/auth')
const chai = require('chai');
const chaiHttp = require('chai-http');
var expect = require("chai").expect;
const serviceAccount = require('../config/serviceAccountKey.json');
const { DEV_API_ENDPOINT } = require('./constant');

require('dotenv').config();

const events = require('./events')
const candidates = require('./candidates')
const members = require('./members')

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
    members.members_test(auth, admin);
    events.events_test(auth, admin);
    candidates.candidates_test(auth,admin);
});