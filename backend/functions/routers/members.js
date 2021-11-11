const express = require('express');
const { firestore } = require('firebase-admin');
const { CLUB_MEMBERS_COLLECTION, EVENTS_COLLECTION, EVENT_ADMINS_COLLECTION, EVENT_MEMBERS_COLLECTION } = require('../constants');

var router = express.Router();


/**
 * Deletes a member from an event
 * @name delete/delete
 * @function
 * @memberof module:routers/members~membersRouter
 * @inner
 * @param { string } member_id 
 * @param { string } target_id
 * @param { string } event_id
 * @returns a success message if member is successfully deleted, an
 * error message otherwise
 */
router.delete('/delete', async (req, res) => {
  var member_id = req.user.uid;
  var { target_id, event_id } = req.body;
  var db = firestore();
  try {
    var deleteRes = await db.collection(EVENT_MEMBERS_COLLECTION).where(
                              "member_id", "==", target_id).where("event_id", "==", event_id).delete();
  } catch (e) {
    res.status(404).send(`Failed to delete ${target_id} from event ${event_id}: ${e}`);

  }
  res.status(200).send(`Ok`);
});

/**
 * This function promotes an existing member of an event to organizer
 * @name POST/member/promote
 * @function
 * @param { string } member_id
 * @param { string } target_id
 * @param {string } event_id
 * @returns a success message if member is successfully promoted, an
 * error message otherwise
 */
router.post('/promote', async (req, res) => {
  var member_id = req.user.uid;
  var { target_id, event_id } = req.body;
  var db = firestore();

  try {
    // create new event in Events db
    var eventMemberDocRef = await db.collection(EVENT_MEMBERS_COLLECTION).where(
                              "member_id", "==", target_id).where("event_id", "==", event_id).get();
    if (eventMemberDocRef.exists()) {
      // TODO: Check for existance of event member in admin and vice versa

      // Remove member from event members
      var deleteRes = await db.collection(EVENT_MEMBERS_COLLECTION).where(
                                "member_id", "==", target_id).where("event_id", "==", event_id).delete();

      // Add member to event admins
      var addRes = await db.collection(EVENT_ADMINS_COLLECTION).add({
        event_id,
        target_id
      })

      res.status(200).send(`Promoted ${target_id} in event ${event_id}`);
    } else {
      res.status(404).send(`Failed to promote ${target_id} in event ${event_id}`);
    }

  } catch (e) {
      res.status(404).send(`Failed to promote ${target_id} in event ${event_id}: ${e}`);
  }
});

/**
 * This function demotes an existing member of an event to regular member
 * @name POST/member/demote
 * @function
 * @param { string } member_id
 * @param { string } target_id
 * @param {string } event_id
 * @returns a success message if member is successfully demoted, an
 * error message otherwise
 */
router.post('/demote', async (req, res) => {
  res.status(200).send(`Ok`);
});


/**
 * Adds a member to an event
 * @name post/add
 * @function
 * @memberof module:routers/members~membersRouter
 * @inner
 * @param { string } member_id 
 * @param { string } event_id
 * @returns { string } a success message if member is successfully added, an
 * error message otherwise
 */
router.post('/add', async (req, res) => {
  var member_id = req.user.uid;
  var { event_id } = req.body;
  var db = firestore();

  try {
    console.log(`eventid: ${event_id}`)
    console.log(typeof(event_id))
    var eventDocRef = await db.collection(EVENTS_COLLECTION).doc(event_id).get();

    if (eventDocRef.exists) {
      var memberDocRef = await db.collection(CLUB_MEMBERS_COLLECTION).doc(member_id).update({
        member_events: firestore.FieldValue.arrayUnion(event_id),
      });
      res.status(200).send(`Member with id ${member_id} added to even with id: ${event_id}`);
    } else {
      res.status(404).send(`Event with id ${event_id} doesn't exist!`)
    }

  } catch (e) {
    res.status(404).send(e);
  }
});


module.exports = router;