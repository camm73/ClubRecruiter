const express = require('express');
var router = express.Router();

/**
 * Adds a member to an event
 * @param { string } member_id 
 * @param { string } event_id
 * @returns { string } a success message if member is successfully added, an
 * error message otherwise
 */
router.post('/add', async (req, res) => {
  res.status(200).send(`Ok`);
});


/**
 * Deletes a member from an event
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
 * @param { string } member_id
 * @param {string } event_id
 * @returns a success message if member is successfully promoted, an
 * error message otherwise
 */
router.put('/promote', async (req, res) => {
  res.status(200).send(`Ok`);
});

/**
 * This function demotes an existing member of an event to regular member
 * @param { string } member_id
 * @param {string } event_id
 * @returns a success message if member is successfully demoted, an
 * error message otherwise
 */
router.put('/demote', async (req, res) => {
  res.status(200).send(`Ok`);
});

module.exports = router;