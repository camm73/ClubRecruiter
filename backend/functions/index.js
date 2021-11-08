const functions = require('firebase-functions')
const express = require('express')

// candidate router
const candidateRouter = require('./routes/candidates')

var app = express()

app.get('/', (req, res) => res.status(200).send('Hey there!'))

// set up candidate Router with the prefix /candidates
app.use("/candidates", candidateRouter);


exports.app = functions.https.onRequest(app)