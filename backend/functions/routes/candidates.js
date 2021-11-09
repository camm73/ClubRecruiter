
const express = require('express');
const admin = require('firebase-admin')
var router = express.Router();

var { CLUB_MEMBERS_COLLECTION } = require('../constants')

/**
 * This function adds a new event candidate to the candidates database
 * @param {req} contains the candidates's eventCode, email, name, phoneNumber,
 * biography, resumeLink and other basic info.
 * @returns a status of 200 if the candidate insertion is successful, 404 if
 * not.
 */
router.post('/add', async (req, res) => {
  var {
    event_code, email, name, phone_number, biography, resume_link,
  } = req.body;

  var db = admin.firestore();
  try {
    const docRef = await db.collection(CLUB_MEMBERS_COLLECTION).add({
      event_code,
      email,
      name,
      phone_number,
      biography,
      applicationStatus: 'pending',
      resume_link,
    });
    res.status(200).send(`Document written with ID: ${docRef.id}`);
  } catch (e) {
    res.status(404).send(`Error adding new candidate: ${e}`);
  }

});


/**
 * This endpoint retrieves all event candidates from the candidates database
 * @param {req.params} contains an event_code
 * @returns all candidates if event_code is not specified, otherwise all
 * candidates given the event_code
 */
router.get('/:event_code', async (req, res) => {
  var db = admin.firestore();
  try {
    // if no event_code is specified
    if (!event_code) {
      // TODO: finish
    }
    res.status(200).send(`Document written with ID: ${docRef.id}`);
  } catch (e) {
    res.status(404).send(`Error adding new candidate: ${e}`);
  }

});

module.exports = router;