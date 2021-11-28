const app = require("../express_generator")();
const { firestore } = require('firebase-admin');
const { validateFirebaseIdToken } = require("../auth");
const { COMMENTS_COLLECTION, CANDIDATES_COLLECTION } = require('../constants');
const { isAdmin } = require("../util");

// TODO: for comments routes, make sure either:
// 1) the current member created that comment, or
// 2) the current member is an admin of the event.

/**
 * Lists all the comments associated with a candidate for a particular event
 * @name GET/comment/by_candidate/:candidate_id
 * @function
 * @param { string } candidate_id unique id of candidate
 * @returns { Object } 200 success message containing comment_ids field which is an array of 
 * ids corresponding to each comment on a candidate. Returns 404 with error message otherwise.
 */
app.get('/by_candidate/:candidate_id', async function (req, res) {
  var { candidate_id } = req.params;

  if (!candidate_id) {
    res.status(404).send("candidate_id should not be empty!");
    return;
  }

  try {
    var db = firestore();
    const candidateRes = await db.collection(CANDIDATES_COLLECTION)
      .doc(candidate_id).get();

    if (!candidateRes.exists) {
      res.status(404).send("Candidate doesn't exist!");
      return;
    }

    if (candidateRes.data().comments) {
      res.status(200).send({
        comment_ids: candidateRes.data().comments
      });
    } else {
      res.status(200).send({
        comment_ids: []
      });
    }


  } catch (e) {
    res.status(404).send(`Error retrieving comments: ${e}`);
  }
});

/**
 * Gets a comment's detail given its id
 * @name GET/comment/:comment_id
 * @function
 * @param { string } comment_id unique id of a comment on a candidate
 * @returns { Object } 200 success message containing the fields comment, member_id, 
 * candidate_id, event_id, timestamp if comment_id is valid. Returns 404 with error message 
 * otherwise.
 */
app.get('/:comment_id', async function (req, res) {
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
 * @param { string } member_id unique id of a member of the event
 * @param { string } candidate_id unique id of candidate of that event
 * @param { string } event_id unique id of the event
 * @param { string } comment comment to add to candidate specified by candidate_id
 * @returns { string } 200 success message containing a comment_id if the comment is properly 
 * inserted. Returns 404 with error message otherwise.
 */
app.post('/add', validateFirebaseIdToken, async (req, res) => {
  var member_id = req.user.uid;
  var { candidate_id, event_id, comment } = req.body;
  try {
    var db = firestore();
    var commentRef = await db.collection(COMMENTS_COLLECTION).add({
      member_id: member_id,
      candidate_id: candidate_id,
      event_id: event_id,
      comment: comment,
      timestamp: Date.now(),
    });

    // add the comment_id to the candidate as well
    await db.collection(CANDIDATES_COLLECTION).doc(candidate_id).update({
      comments: firestore.FieldValue.arrayUnion(commentRef.id)
    })
    res.status(200).send({
      comment_id: commentRef.id
    });
  } catch (e) {
    res.status(404).send(`Error: ${e}`);
  }
});


/**
 * Deletes a comment from comments database
 * @name DELETE/comment/delete
 * @function
 * @param { string } comment_id unique id of comment
 * @returns { string } 200 success message if comment is successfully deleted. Returns 404 
 * with error message otherwise.
 */
app.post('/delete', validateFirebaseIdToken, async (req, res) => {
  var member_id = req.user.uid;
  var { comment_id } = req.body;

  try {
    var db = firestore();
    const commentRef = db.collection(COMMENTS_COLLECTION).doc(comment_id);

    var { event_id, candidate_id } = (await commentRef.get()).data();

    if (!(await isAdmin(member_id, event_id))) {
      res.status(404).send(`Non-admin cannot delete comments!`);
      return;
    }

    await db.collection(CANDIDATES_COLLECTION)
      .doc(candidate_id).update({
        comments: firestore.FieldValue.arrayRemove(comment_id)
      });


    await commentRef.delete();
    res.status(200).send(`Deleted ${comment_id}`);
  } catch (e) {
    res.status(404).send(`Failed to delete: ${e}`)
  }
});

module.exports = app;