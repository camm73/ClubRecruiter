const express = require('express');
var router = express.Router();

/**
 * This function adds a member to an event
 * @param {req} contains memberID and an eventID
 * @returns a status of 200 if the event delete is successful, else 404
 */
router.post('/add', async (req, res) => {
  res.status(200).send(`Ok`);
});


/**
 * This function deletes a member from an event
 * @param {req} contains memberID and an eventID
 * @returns a status of 200 if the member delete is successful, else 404
 */
router.delete('/delete', async (req, res) => {
  res.status(200).send(`Ok`);
});

/**
 * This function promotes an existing member of an event to organizer
 * @param {req} contains memberID and an eventID
 * @returns a status of 200 if the promotion is successful, else 404
 */
router.put('/promote', async (req, res) => {
  res.status(200).send(`Ok`);
});

/**
 * This function demotes an existing member of an event to regular member
 * @param {req} contains memberID and an eventID
 * @returns a status of 200 if the demotion is successful, else 404
 */
router.put('/demote', async (req, res) => {
  res.status(200).send(`Ok`);
});

module.exports = router;