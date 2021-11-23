const app = require("../express_generator")();
const { firestore } = require('firebase-admin');
const { member } = require("..");
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
 * @param { string } candidate_id
 * @returns { Object[] } a list of all comments for candidateID 
 * 
 */
app.get('/by_candidate/:candidate_id', async function (req, res) {
  var { candidate_id } = req.params;

  try {
    var db = firestore();
    const candidateRes = await db.collection(CANDIDATES_COLLECTION)
      .doc(candidate_id).get();

    res.status(200).send({
      comment_ids: candidateRes.data().comments
    });
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
 * @param { string } member_id
 * @param { string } candidate_id
 * @param { string } event_id
 * @param { string } comment
 * @returns { string } unique comment ID if the new comment is inserted
 * properly, an error message otherwise
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
      .where("candidate_id", "==", candidate_id).get()
      .then((querySnapshot) => {
        querySnapshot.forEach(function (document) {
          document.ref.update({
            comments: firestore.FieldValue.arrayRemove(comment_id)
          });
        });
      });

    await commentRef.delete();
    res.status(200).send(`Deleted ${comment_id}`);
  } catch (e) {
    res.status(404).send(`Failed to delete: ${e}`)
  }
});

module.exports = app;