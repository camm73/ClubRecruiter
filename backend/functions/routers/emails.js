const express = require('express');
const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const { validateFirebaseIdToken } = require('../auth');
const nodemailer = require('nodemailer');
const { CANDIDATES_COLLECTION } = require('../constants');

var router = express.Router();

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: '********@gmail.com', // TODO: fill in later
    pass: '************' // TODO: fill in later
  }
});

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
  var db = firestore();

  for (var candidate_id in candidate_ids) {
    var candidateRef = await db
      .collection(CANDIDATES_COLLECTION)
      .doc(candidate_id)
      .get();
    var target_email = candidateRef.data()['email'];

    const mail_options = {
      from: `uclasep@gmail.com`,
      to: target_email,
      subject: email_subject,
      html: `<p>${email_content}</p>`
    };

    transporter.sendMail(mail_options, (error, data) => {
      if (error) {
        console.log(error)
        res.status(404).send(`Error sending email: ${error}`)
        return
      }
      console.log("Sent!")
    });
  }
  res.status(200);

});

module.exports = router;