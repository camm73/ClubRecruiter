var admin = require('firebase-admin');
var express = require('express');
var router = express.Router();

/**
 * This function lists all the comments associated with a candidate for a particular event
 * @param {req} contains eventID, candidateID
 * @returns a list of all comments for candidateID for the particular eventID
 */
router.get('/comments/list', async function (req, res) {
  res.status(200).send(`comments list`);
});

/**
 * This function adds a comment to a candidate for a particular event
 * @param {req} contains memberID, eventID, candidateID, comment string
 * @returns a status of 200 if the comment is successfully added, else 404
 */
router.post('/comments/add', async (req, res) => {
  res.status(200).send(`Ok`);
});


/**
 * This function deletes a comment from comments database
 * @param {req} contains commentID
 * @returns a status of 200 if the comment delete is successful, else 404
 */
router.delete('/comments/delete', async (req, res) => {
  res.status(200).send(`Ok`);
});

module.exports = router;