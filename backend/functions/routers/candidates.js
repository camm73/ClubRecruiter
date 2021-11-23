const app = require("../express_generator")();
const { firestore } = require('firebase-admin')
const admin = require('firebase-admin');

var { EVENTS_COLLECTION, CANDIDATES_COLLECTION, CANDIDATE_CODE } = require('../constants');
const { validateCandidateCode } = require('../util');

// TODO: for candidates routes, make sure either:
// the current member is an admin of the event that the candidate is in.


/**
 * Validates a candidate_code submitted to our backend
 * @name GET/candidate/validate
 * @function
 * @param { string } candidate_code
 * @returns { Object } True if the candidate code is valid, False otherwise
 * 
 */
app.get('/validate', async function (req, res) {
  var { candidate_code } = req.query;

  try {
    var valid = await validateCandidateCode(candidate_code);
    res.status(200).send({
      valid: valid
    });
  } catch (e) {
    res.status(404).send(`Error retrieving candidate: ${e}`);
  }
});


/**
 * Gets a candidate's detail given its id
 * @name GET/candidate/:candidate_id
 * @function
 * @param { string } candidate_id
 * @returns { Object } candidate detail with candidate_id
 * 
 */
app.get('/:candidate_id', async function (req, res) {
  var { candidate_id } = req.params;

  try {
    var db = firestore();
    const candidateRes = await db.collection(CANDIDATES_COLLECTION).doc(candidate_id).get();

    res.status(200).send(candidateRes.data());
  } catch (e) {
    res.status(404).send(`Error retrieving candidate: ${e}`);
  }
});

/**
 * A new event candidate applies to an event, backend adds the candidate to the
 * the candidates database along with their basic information
 * @name POST/candidate/apply
 * @function
 * @param { string } candidate_code
 * @param { string } email
 * @param { string } name
 * @param { string } phone_number
 * @param { string } biography
 * @param { string } resume_id
 * @param { string } profile_pic_id
 * @returns { string } unique candidate ID if the new candidate is inserted
 * properly, an error message otherwise
 */
app.post('/apply', async (req, res) => {
  var {
    candidate_code, email, name, phone_number, biography, resume_id, profile_pic_id,
  } = req.body;

  candidate_code = candidate_code.toLowerCase();

  if (!profile_pic_id)
    profile_pic_id = "";

  var db = firestore();
  try {
    var is_code_valid = await validateCandidateCode(candidate_code);

    if (is_code_valid) {
      const candidateDocRef = await db.collection(CANDIDATES_COLLECTION).add({
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
      await db.collection(EVENTS_COLLECTION)
        .where(CANDIDATE_CODE, "==", candidate_code)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(function (document) {
            document.ref.update({
              candidates: admin.firestore.FieldValue.arrayUnion(candidateDocRef.id)
            });
          });
        });
      res.status(200).send(`Candidate with id ${candidateDocRef.id} applied to event successfully!`);
      return;

    } else {
      res.status(404).send(`Incorrect candidate_code!`);
      return;
    }
  } catch (e) {
    res.status(404).send(`Error adding new candidate: ${e}`);
  }

});


/**
 * Updates a candidate's status to either "accepted", "rejected", or "pending"
 * @name POST/candidate/status
 * @function
 * @param { string } status
 * @param { string } candidate_id
 * @returns { string } Status 200 success if update is successful, 404 otherwise
 * 
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
 * @param {string} event_id
 * @returns {string[]} candidates for an event_id
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

module.exports = app;