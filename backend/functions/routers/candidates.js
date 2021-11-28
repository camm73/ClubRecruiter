const app = require("../express_generator")();
const { firestore } = require('firebase-admin');
const { validateFirebaseIdToken } = require("../auth");

var { EVENTS_COLLECTION, CANDIDATES_COLLECTION, CANDIDATE_CODE, COMMENTS_COLLECTION } = require('../constants');
const { validateCandidateCode, deleteFile, isAdmin } = require('../util');

// TODO: for candidates routes, make sure either:
// the current member is an admin of the event that the candidate is in.


/**
 * Validates a candidate_code submitted to our backend
 * @name GET/candidate/validate
 * @function
 * @param { string } candidate_code candidate_code of an event
 * @returns { Object } 200 success message containing valid field taking on 
 * value based on validity of candidate_code. Returns 404 with error message otherwise.
 */
app.get('/validate', async function (req, res) {
  var { candidate_code } = req.query;

  try {
    var valid = await validateCandidateCode(candidate_code);
    res.status(200).send({
      valid: valid
    });
  } catch (e) {
    res.status(404).send(`Error validating candidate code: ${e}`);
  }
});


/**
 * Gets a candidate's detail given its id
 * @name GET/candidate/:candidate_id
 * @function
 * @param { string } candidate_id the unique id of the candidate
 * @returns { Object } 200 success message containing the following candidate details if
 * candidate_id is valid: name, biography, event_id, profile_pic_id, candidate_code, email, 
 * resume_id, comments and application_status. Returns 404 with error message otherwise.
 */
app.get('/:candidate_id', async function (req, res) {
  var { candidate_id } = req.params;

  try {
    var db = firestore();
    const candidateRes = await db.collection(CANDIDATES_COLLECTION).doc(candidate_id).get();

    if (!candidateRes.exists) {
      res.status(404).send(`Error retrieving candidate: ${candidate_id}`);
    } else {
      res.status(200).send(candidateRes.data());
    }
  } catch (e) {
    res.status(404).send(`Error retrieving candidate: ${e}`);
  }
});

/**
 * A new event candidate applies to an event, backend adds the candidate to the
 * the candidates database along with their basic information
 * @name POST/candidate/apply
 * @function
 * @param { string } candidate_code candidate_code for the event
 * @param { string } email email of candidate
 * @param { string } name name of candidate
 * @param { string } phone_number phone number of candidate
 * @param { string } biography biography of candidate
 * @param { string } resume_id id of resume uploaded by candidate
 * @param { string } profile_pic_id id of profile picture uploaded by candidate
 * @returns { string } 200 success message containing unique candidate ID if the new 
 * candidate is inserted properly. Returns 404 with error message otherwise.
 */
app.post('/apply', async (req, res) => {
  var {
    candidate_code, email, name, phone_number, biography, resume_id, profile_pic_id,
  } = req.body;

  candidate_code = candidate_code.toLowerCase();

  if (!profile_pic_id)
    profile_pic_id = "";

  var db = firestore();

  if (!(await validateCandidateCode(candidate_code))) {
    res.status(404).send(`Incorrect candidate_code!`);
    return;
  }

  try {
    var eventRef = await db.collection(EVENTS_COLLECTION)
      .where(CANDIDATE_CODE, "==", candidate_code)
      .get();

    var event_id = eventRef.docs[0].id;

    const candidateDocRef = await db.collection(CANDIDATES_COLLECTION).add({
      event_id: event_id,
      candidate_code: candidate_code,
      email: email,
      name: name,
      phone_number: phone_number,
      biography: biography,
      application_status: 'pending',
      resume_id: resume_id,
      profile_pic_id: profile_pic_id,
      comments: [],
    }); // creates a new candidate profile

    // add the candidate to the respective event
    await db.collection(EVENTS_COLLECTION).doc(event_id)
      .update({
        candidates: firestore.FieldValue.arrayUnion(candidateDocRef.id)
      })

    res.status(200).send({
      candidate_id: candidateDocRef.id
    });
    return;

  } catch (e) {
    res.status(404).send(`Error adding new candidate: ${e}`);
  }

});


/**
 * Updates a candidate's status to either "accepted", "rejected", or "pending"
 * @name POST/candidate/status
 * @function
 * @param { string } status status to set candidate's application to
 * @param { string } candidate_id unique id of candidate
 * @returns { string } 200 success message if update is successful. 
 * Returns 404 with error message otherwise.
 */
app.post('/status', async function (req, res) {
  var { candidate_id, status } = req.body;
  var db = firestore();

  status = status.toLowerCase();
  if (!(["accepted", "rejected", "pending"].includes(status))) {
    res.status(404).send(`Invalid status!`);
    return;
  }
  try {
    await db.collection(CANDIDATES_COLLECTION).doc(candidate_id).update({
      "application_status": status
    });
    res.status(200).send("Success!");
  } catch (e) {
    res.status(404).send(`Error updating candidate status: ${e}`);
  }

})


/**
 * This endpoint retrieves a list of candidate IDs from the
 * Candidates database
 * @name GET/by_event/:event_id
 * @function
 * @param {string} event_id unique id of the event
 * @returns {string[]} 200 success message with field candidate_ids, an array of 
 * candidate_ids corresponding to candidates of the event. Returns 404 with error message 
 * otherwise.
 */
app.get('/by_event/:event_id', async (req, res) => {
  var { event_id } = req.params;
  try {
    var db = firestore();
    const eventDocRef = await db.collection(EVENTS_COLLECTION).doc(event_id).get();
    const candidate_ids = eventDocRef.data().candidates;

    res.status(200).send({
      candidate_ids: candidate_ids,
    });
  } catch (e) {
    res.status(404).send(`Error retrieving candidates: ${e}`);
  }
});

/**
 * Deletes a candidate given their candidate_id
 * @name DELETE/candidate/delete
 * @function
 * @param { string } candidate_id unique id of candidate
 * @param { string } member_id unique id of member in the event
 * @returns { string } 200 success message if delete is successful. 
 * Returns 404 with error message otherwise.
 */
app.delete('/delete', validateFirebaseIdToken, async function (req, res) {
  var member_id = req.user.uid;
  var { candidate_id } = req.body;
  var db = firestore();

  try {
    // Deleting a candidate requires multiple steps:
    // 1. Remove all the comments related to this specific candidate
    // 2. Remove its candidate_id from the parent event
    // 3. Delete the candidate's resume from Cloud Storage
    // 4. Finally, delete the Candidate entry
    var candidateRef = db.collection(CANDIDATES_COLLECTION).doc(candidate_id);
    var candidateData = (await candidateRef.get()).data();
    var event_id = candidateData.event_id;

    if (!(await isAdmin(member_id, event_id))) {
      res.status(404).send('Non-admins cannot delete candidates!');
      return;
    }

    // step 1
    candidateData.comments.forEach((comment_id) => {
      db.collection(COMMENTS_COLLECTION).doc(comment_id).delete();
    })

    // step 2
    db.collection(EVENTS_COLLECTION)
      .doc(event_id)
      .update({
        candidates: firestore.FieldValue.arrayRemove(candidate_id)
      })

    // step 3
    var resume_id = candidateData.resume_id;
    deleteFile(`resume/${resume_id}`);

    // step 4
    candidateRef.delete();
    res.status(200).send("Success!");
  } catch (e) {
    res.status(404).send(`Error deleting candidate: ${e}`);
  }

})

module.exports = app;