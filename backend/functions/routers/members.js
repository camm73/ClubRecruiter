/** Express router providing members related routes
 * @module routers/members
 * @requires express
 * @requires firebase-admin
 */

const express = require('express');
const { firestore } = require('firebase-admin');
const { CLUB_MEMBERS_COLLECTION } = require('../constants');

/**
 * Express router to mount member related functions on.
 * @type {object}
 * @const
 * @namespace membersRouter
 */
var router = express.Router();


/**
 * Deletes a member from an event
 * @name delete/delete
 * @function
 * @memberof module:routers/members~membersRouter
 * @inner
 * @param { string } member_id 
 * @param { string } event_id
 * @returns a success message if member is successfully deleted, an
 * error message otherwise
 */
router.delete('/delete', async (req, res) => {
  res.status(200).send(`Ok`);
});

/**
 * This function promotes an existing member of an event to organizer
 * @name post/promote
 * @function
 * @memberof module:routers/members~membersRouter
 * @inner
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
 * @name post/demote
 * @function
 * @memberof module:routers/members~membersRouter
 * @inner
 * @param { string } member_id
 * @param {string } event_id
 * @returns a success message if member is successfully demoted, an
 * error message otherwise
 */
router.post('/demote', async (req, res) => {
  res.status(200).send(`Ok`);
});

module.exports = router;