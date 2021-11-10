/** Express router providing candidates related routes
 * @module routers/candidates
 * @requires express
 * @requires firebase-admin
 */

const express = require('express');
const admin = require('firebase-admin')

/**
 * Express router to mount candidate related functions on.
 * @type {object}
 * @const
 * @namespace candidatesRouter
 */
var router = express.Router();

var { CLUB_MEMBERS_COLLECTION } = require('../constants')

/**
 * Adds a new event candidate to the candidates database along
 * with their basic information
 * @name post/add
 * @function
 * @memberof module:routers/candidates~candidatesRouter
 * @inner
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

  var db = admin.firestore();
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
 * @name get/:event_code
 * @function
 * @memberof module:routers/candidates~candidatesRouter
 * @inner
 * @param {string} event_code
 * @returns {String[]} all candidates if event_code is not specified, otherwise
 * candidates given the event_code
 */
router.get('/:event_code', async (req, res) => {
  var { event_code } = req.params;
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