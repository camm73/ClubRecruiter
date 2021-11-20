const express = require('express')
const { firestore } = require('firebase-admin')
const admin = require('firebase-admin');
var router = express.Router();

var { CLUB_MEMBERS_COLLECTION, EVENTS_COLLECTION, CANDIDATES_COLLECTION, CANDIDATE_CODE } = require('../constants')

// TODO: for candidates routes, make sure either:
// the current member is an admin of the event that the candidate is in.

/**
 * Gets a candidate's detail given its id
 * @name GET/candidate/:candidate_id
 * @function
 * @param { string } candidate_id
 * @returns { Object } candidate detail with candidate_id
 * 
 */
router.get('/:candidate_id', async function (req, res) {
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
 * @returns { string } unique candidate ID if the new candidate is inserted
 * properly, an error message otherwise
 */
router.post('/apply', async (req, res) => {
  var {
    candidate_code, email, name, phone_number, biography, resume_id,
  } = req.body;

  var db = firestore();
  try {
    var eventDocRef = await db.collection(EVENTS_COLLECTION)
      .where(CANDIDATE_CODE, "==", candidate_code).get();

    if (!eventDocRef.empty) {
      const candidateDocRef = await db.collection(CANDIDATES_COLLECTION).add({
        candidate_code: candidate_code,
        email: email,
        name: name,
        phone_number: phone_number,
        biography: biography,
        application_status: 'pending',
        resume_id: resume_id,
      }); // creates a new candidate profile

      // add the candidate to the respective member
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
 * This endpoint retrieves a list of candidate IDs from the
 * Candidates database
 * @name GET/by_event/:event_id
 * @function
 * @param {string} event_id
 * @returns {String[]} candidates for an event_id
 */
router.get('/by_event/:event_id', async (req, res) => {
  var { event_id } = req.params;
  try {
    var db = firestore();
    const eventDocRef = await db.collection(EVENTS_COLLECTION).doc(event_id).get();
    const candidate_ids = eventDocRef.data()['candidates'];

    const candidates = []
    for (var idx in candidate_ids) {
      let candidate_id = candidate_ids[idx];
      const candidatesDocRef = await db.collection(CANDIDATES_COLLECTION).doc(candidate_id).get();
      candidates.push(candidatesDocRef.data());
    };

    res.status(200).send(candidates);
  } catch (e) {
    res.status(404).send(`Error retrieving candidates: ${e}`);
  }
});

module.exports = router;