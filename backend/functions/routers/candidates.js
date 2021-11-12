const express = require('express')
const { firestore } = require('firebase-admin')
var router = express.Router();

var { CLUB_MEMBERS_COLLECTION, EVENTS_COLLECTION, CANDIDATES_COLLECTION } = require('../constants')

/**
 * Adds a new event candidate to the candidates database along
 * with their basic information
 * @name POST/candidate/add
 * @function
 * @param { string } event_code
 * @param { string } email
 * @param { string } name
 * @param { string } phone_number
 * @param { string } biography
 * @param { string } resume_id
 * @returns { string } unique candidate ID if the new candidate is inserted
 * properly, an error message otherwise
 */
router.post('/add', async (req, res) => {
  var {
    event_code, email, name, phone_number, biography, resume_id,
  } = req.body;

  var db = firestore();
  try {
    const docRef = await db.collection(CLUB_MEMBERS_COLLECTION).add({
      event_code,
      email,
      name,
      phone_number,
      biography,
      applicationStatus: 'pending',
      resume_id,
    });
    res.status(200).send(`Document written with ID: ${docRef.id}`);
  } catch (e) {
    res.status(404).send(`Error adding new candidate: ${e}`);
  }

});


/**
 * This endpoint retrieves a list of candidate IDs from the
 * Candidates database
 * @name GET/candidate/:event_id
 * @function
 * @param {string} event_id
 * @returns {String[]} candidates for an event_id
 */
router.get('/:event_id', async (req, res) => {
  var { event_id } = req.params;
  try {
    var db = firestore();
    const eventDocRef = await db.collection(EVENTS_COLLECTION).doc(event_id).get();
    const candidate_ids = eventDocRef.data().candidates;
    
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