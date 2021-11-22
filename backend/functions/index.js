const functions = require('firebase-functions')
const admin = require('firebase-admin')

// routes
const candidateApp = require('./routers/candidates')
const eventApp = require('./routers/events')
const commentApp = require('./routers/comments')
const memberApp = require('./routers/members')

// initialize firestore app
admin.initializeApp();

exports.candidate = functions.https.onRequest(candidateApp)
exports.event = functions.https.onRequest(eventApp)
exports.comment = functions.https.onRequest(commentApp)
exports.member = functions.https.onRequest(memberApp)