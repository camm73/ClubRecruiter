const functions = require('firebase-functions')
const admin = require('firebase-admin')

// routes
const candidateApp = require('./routers/candidates')
const eventApp = require('./routers/events')
const commentApp = require('./routers/comments')
const memberApp = require('./routers/members')

// initialize firestore app
admin.initializeApp();

const runtimeOpts = {
  memory: '512MB'
}

exports.candidate = functions.runWith(runtimeOpts).https.onRequest(candidateApp)
exports.event = functions.runWith(runtimeOpts).https.onRequest(eventApp)
exports.comment = functions.runWith(runtimeOpts).https.onRequest(commentApp)
exports.member = functions.runWith(runtimeOpts).https.onRequest(memberApp)