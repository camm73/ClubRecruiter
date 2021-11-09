const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
var app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { validateFirebaseIdToken } = require('./auth')

// routers
const candidateRouter = require('./routes/candidates')
const eventRouter = require('./routes/events')
const commentRouter = require('./routes/comments')

// initialize firestore app
admin.initializeApp();

app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => res.status(200).send('Hey there!'))

// set up candidate Router with the prefix /candidate
app.use("/candidate", candidateRouter);
// auth protected version below, uncomment when testing is finished
// app.use("/event", validateFirebaseIdToken, eventRouter);
app.use("/event", eventRouter);
app.use("/comment", commentRouter);


exports.app = functions.https.onRequest(app)
