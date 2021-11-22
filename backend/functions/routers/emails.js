const express = require('express');
const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const { validateFirebaseIdToken } = require('../auth');
const { route } = require('./candidates');

var router = express.Router();

/**
 * Sends a basic email to the given candidate
 * @name POST/email
 * @function
 * @param { string } member_id for validation purposes only
 * @param { string } email_content
 * @param { string } email_subject
 * @param { string[] } candidate_ids
 * @returns { Object } member detail with member_id
 *
 */
router.post('/', validateFirebaseIdToken, async function (req, res) {
  var { email_content, email_subject, candidate_ids } = req.body;
});