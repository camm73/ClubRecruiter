const express = require('express');
const { firestore } = require('firebase-admin');
const { CLUB_MEMBERS_COLLECTION } = require('../constants');

var router = express.Router();

/**
 * This function promotes an existing member of an event to organizer
 * @name POST/member/promote
 * @function
 * @param { string } member_id
 * @param {string } event_id
 * @returns a success message if member is successfully promoted, an
 * error message otherwise
 */
router.post('/promote', async (req, res) => {
  res.status(200).send(`Ok`);
});

/**
 * This function demotes an existing member of an event to regular member
 * @name POST/member/demote
 * @function
 * @param { string } member_id
 * @param {string } event_id
 * @returns a success message if member is successfully demoted, an
 * error message otherwise
 */
router.post('/demote', async (req, res) => {
  res.status(200).send(`Ok`);
});

module.exports = router;