const express = require('express');
const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const { validateFirebaseIdToken } = require('../auth');
const nodemailer = require('nodemailer');
const { CANDIDATES_COLLECTION, FROM_EMAIL, EMAIL_TEMPLATE, EVENTS_COLLECTION } = require('../constants');
const { isAdmin } = require('../util');

require('dotenv').config();

var router = express.Router();

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS
  }
});

function formatEmail(email_template, candidate_name, event_name, application_status) {
  var s = email_template.replace("__{candidate_name}__", candidate_name);
  s = s.replace("__{event_name}__", event_name);
  s = s.replace("__{application_status}__", application_status);
  return s;
}

/**
 * Sends a basic email to the given candidate
 * @name POST/email
 * @function
 * @param { string } member_id for validation purposes only
 * @param { string } email_subject
 * @param { string } email_body
 * @param { string } event_id
 * @param { string[] } candidate_ids
 * @returns { Object } member detail with member_id
 *
 */
router.post('/', validateFirebaseIdToken, async function (req, res) {
  var member_id = req.user.uid;
  var { email_subject, email_body, event_id, candidate_ids } = req.body;

  if (!email_body)
    email_body = EMAIL_TEMPLATE;

  if (!(await isAdmin(member_id, event_id))) {
    res.status(404).send('Non-admins cannot send mass emails!');
    return;
  }

  try {
    var db = firestore();

    candidate_ids.forEach(async (candidate_id) => {
      var candidateRef = await db
        .collection(CANDIDATES_COLLECTION)
        .doc(candidate_id)
        .get();
      var target_email = candidateRef.data().email;

      var eventRef = await db
        .collection(EVENTS_COLLECTION)
        .doc(candidateRef.data().event_id)
        .get();

      var email_html = formatEmail(email_body, candidateRef.data().name, eventRef.data().name, candidateRef.data().application_status)

      const mail_options = {
        from: FROM_EMAIL,
        to: target_email,
        subject: email_subject,
        html: email_html
      };

      transporter.sendMail(mail_options, (error, data) => {
        if (error) {
          console.log(error)
          res.status(404).send(`Error sending email: ${error}`)
          return
        }
        console.log("Sent!")
      });
    })
    res.status(200);
  } catch (err) {
    res.status(404).send(err);
  }


});

module.exports = router;