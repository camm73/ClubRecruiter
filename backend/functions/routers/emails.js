const app = require("../express_generator")();
const functions = require('firebase-functions');
const { firestore } = require('firebase-admin');
const { validateFirebaseIdToken } = require('../auth');
const nodemailer = require('nodemailer');
const { CANDIDATES_COLLECTION, FROM_EMAIL, EVENTS_COLLECTION, EMAIL_TEMPLATE_TOP, EMAIL_TEMPLATE_BOTTOM } = require('../constants');
const { isAdmin } = require('../util');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: functions.config().email.email_id,
    pass: functions.config().email.email_pass
  }
});

function formatEmail(email_template, candidate_name, event_name, application_status) {
  var s = email_template.replace(/__{candidate_name}__/g, candidate_name);
  s = s.replace(/__{event_name}__/g, event_name);
  s = s.replace(/__{application_status}__/g, application_status);
  return s;
}

function processBody(body) {
  const sentenceArr = body.split(/[\r\n]+/); // splits new lines
  const htmlArr = [];

  for (const sentence of sentenceArr) {
    // Need to escape end tag characters
    const sanitizedSentence = sentence.replace('<', '').replace('>', '');
    if (sanitizedSentence.length > 0) {
      htmlArr.push(`<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">${sanitizedSentence}</p>`);
    } else {
      htmlArr.push('<br>');
    }
  }

  let finalBody = EMAIL_TEMPLATE_TOP;
  for (const htmlStr of htmlArr) {
    finalBody += `${htmlStr}\n`;
  }
  finalBody += EMAIL_TEMPLATE_BOTTOM;

  return finalBody;
}

/**
 * Sends a basic email to the given candidate
 * @name POST/email
 * @function
 * @param { string } member_id for validation purposes only
 * @param { string } email_subject The title of the email
 * @param { string } email_body The body of the meail. Completely optional, if
 * not present, will use the default EMAIL_TEMPLATE
 * @param { string } event_id the event_id that is sending out the
 * acceptance/rejection emails
 * @param { string[] } candidate_ids the list of candidate_ids that we're
 * sending out emails to
 * @returns { Object } member detail with member_id
 *
 */
app.post('/', validateFirebaseIdToken, async function (req, res) {
  var member_id = req.user.uid;
  var { email_subject, email_body, event_id, candidate_ids } = req.body;

  if (!(await isAdmin(member_id, event_id))) {
    res.status(404).send('Non-admins cannot send mass emails!');
    return;
  }

  if (!email_body) {
    res.status(404).send("No email body was provided!");
    return;
  }
  email_body = processBody(email_body);

  try {
    var db = firestore();

    var eventRef = await db
      .collection(EVENTS_COLLECTION)
      .doc(event_id)
      .get();

    if (!eventRef.exists) {
      res.status(404).send(`Event with id ${event_id} doesn't exist!`);
      return;
    }

    candidate_ids.forEach(async (candidate_id) => {
      var candidateRef = await db
        .collection(CANDIDATES_COLLECTION)
        .doc(candidate_id)
        .get();

      if (!candidateRef.exists) {
        res.status(404).send(`Candidate with id ${candidate_id} doesn't exist!`);
        return;
      }


      var target_email = candidateRef.data().email;

      var email_html = formatEmail(email_body, candidateRef.data().name,
        eventRef.data().name, candidateRef.data().application_status)

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
    res.status(200).send("Successfully sent emails!");
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = app;