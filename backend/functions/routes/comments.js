var admin = require('firebase-admin');
var express = require('express');
var router = express.Router();

/**
 * Lists all the comments associated with a candidate for a particular event
 * @param { string } event_id
 * @param { string } candidate_id
 * @returns { Object[] } a list of all comments for candidateID for the
 * particular eventID 
 */
router.get('/list', async function (req, res) {
  res.status(200).send(`comments list`);
});

/**
 * Adds a comment to a candidate for a particular event
 * @param { string } member_id
 * @param { string } event_id
 * @param { string } candidate_id
 * @param { string } comment
 * @returns { string } unique comment ID if the new comment is inserted
 * properly, an error message otherwise
 */
router.post('/add', async (req, res) => {
  res.status(200).send(`Ok`);
});


/**
 * Deletes a comment from comments database
 * @param { string } comment_id
 * @returns { string } a success status message if the comment is deleted
 * successfully, an error message otherwise
 */
router.delete('/delete', async (req, res) => {
  res.status(200).send(`Ok`);
});

module.exports = router;