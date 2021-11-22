const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
var app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { validateFirebaseIdToken } = require('./auth')

// routers
const candidateRouter = require('./routers/candidates')
const eventRouter = require('./routers/events')
const commentRouter = require('./routers/comments')
const memberRouter = require('./routers/members')
const emailRouter = require('./routers/emails')

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
app.use("/member", memberRouter);
app.use("/email", emailRouter);


exports.app = functions
  .runWith({
    memory: "1GB",
  })
  .https.onRequest(app)
