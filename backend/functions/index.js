const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cookieParser = require('cookie-parser')

admin.initializeApp();

// candidate router
const candidateRouter = require('./routes/candidates')

const eventRouter = require('./routes/events')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => res.status(200).send('Hey there!'))

// set up candidate Router with the prefix /candidates
app.use("/candidate", candidateRouter);
// app.use("/events", eventRouter);


exports.app = functions.https.onRequest(app)