const { firestore } = require('firebase-admin');
var express = require('express');
const { COMMENTS_COLLECTION } = require('../constants');
var router = express.Router();

/**
 * Lists all the comments associated with a candidate for a particular event
 * @name GET/comment/by_candidate/:candidate_id
 * @function
 * @param { string } candidate_id
 * @returns { Object[] } a list of all comments for candidateID 
 * 
 */
router.get('/by_candidate/:candidate_id', async function (req, res) {
  var { candidate_id } = req.params;

  try {
    var db = firestore();
    const commentsRes = await db.collection(COMMENTS_COLLECTION).where("candidate_id", "==", candidate_id).get()

    res.status(200).send(commentsRes.docs.map(doc => Object.assign(doc.data(), { id: doc.id })));
  } catch (e) {
    res.status(404).send(`Error retrieving comments: ${e}`);
  }
});

/**
 * Gets a comment's detail given its id
 * @name GET/comment/:comment_id
 * @function
 * @param { string } comment_id
 * @returns { Object } comment detail with comment_id
 * 
 */
router.get('/:comment_id', async function (req, res) {
  var { comment_id } = req.params;

  try {
    var db = firestore();
    const commentRes = await db.collection(COMMENTS_COLLECTION).doc(comment_id).get();

    res.status(200).send(commentRes.data());
  } catch (e) {
    res.status(404).send(`Error retrieving comment: ${e}`);
  }
});



/**
 * Adds a comment to a candidate for a particular event
 * @name POST/comment/add
 * @function
 * @param { string } member_id
 * @param { string } candidate_id
 * @param { string } comment
 * @returns { string } unique comment ID if the new comment is inserted
 * properly, an error message otherwise
 */
router.post('/add/:candidate_id', async (req, res) => {
  var { member_id } = req.user.uid;
  var { candidate_id } = req.params;
  var { comment } = req.body;
  try {
    var db = firestore();
    const addRes = await db.collection(COMMENTS_COLLECTION).add({
      member_id,
      candidate_id,
      comment,
      timestamp: Date.now(),
    });
    res.status(200).send(`Successfully added comment`);
  } catch (e) {
    res.status(404).send(`Error: ${e}`);
  }
});


/**
 * Deletes a comment from comments database
 * @name DELETE/comment/delete
 * @function
 * @param { string } comment_id
 * @returns { string } a success status message if the comment is deleted
 * successfully, an error message otherwise
 */
router.post('/delete/:comment_id', async (req, res) => {
  var { member_id } = req.user.uid;
  var { comment_id } = req.params;

  try {
    var db = firestore();
    const delRef = await db.collection(COMMENTS_COLLECTION).doc(comment_id).delete();

    res.status(200).send(`Deleted ${comment_id}`);
  } catch (e) {
    res.status(404).send(`Failed to delete: ${e}`)
  }
});

module.exports = router;