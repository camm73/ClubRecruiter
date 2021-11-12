const express = require('express');
const { firestore } = require('firebase-admin');
const { EVENTS_COLLECTION, EVENT_ADMINS_COLLECTION, EVENT_MEMBERS_COLLECTION } = require('../constants');

var router = express.Router();


/**
 * This function promotes an existing member of an event to organizer
 * @name POST/member/promote/:target_id
 * @function
 * @param { string } member_id
 * @param { string } target_id id of the member to promote
 * @param {string } event_id
 * @returns a success message if member is successfully promoted, an
 * error message otherwise
 */
router.post('/promote/:target_id', async (req, res) => {
  var member_id = req.user.uid;
  var { target_id } = req.params;
  var { event_id } = req.body;
  var db = firestore();

  try {
    const eventMemberDocRef = await db.collection(EVENT_MEMBERS_COLLECTION).where(
                              "member_id", "==", target_id).where("event_id", "==", event_id).get();

    if (!eventMemberDocRef.empty) {
      const delete_id = eventMemberDocRef.docs[0].id;

      // Remove member from event members
      var deleteRes = await db.collection(EVENT_MEMBERS_COLLECTION).doc(delete_id).delete()

      // Add member to event admins
      var addRes = await db.collection(EVENT_ADMINS_COLLECTION).add({
        event_id,
        member_id: target_id
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
 * @name POST/member/demote/:target_id
 * @function
 * @param { string } member_id
 * @param { string } target_id id of the member to demote
 * @param {string } event_id
 * @returns a success message if member is successfully demoted, an
 * error message otherwise
 */
router.post('/demote/:target_id', async (req, res) => {
  var member_id = req.user.uid;
  var { target_id } = req.params;
  var { event_id } = req.body;
  var db = firestore();

  try {
    const eventAdminDocRef = await db.collection(EVENT_ADMINS_COLLECTION).where(
                              "member_id", "==", target_id).where("event_id", "==", event_id).get();

    if (!eventAdminDocRef.empty) {
      const delete_id = eventAdminDocRef.docs[0].id;

      // Remove member from event admins
      var deleteRes = await db.collection(EVENT_ADMINS_COLLECTION).doc(delete_id).delete()

      // Add member to event members
      var addRes = await db.collection(EVENT_MEMBERS_COLLECTION).add({
        event_id,
        member_id: target_id
      })

      res.status(200).send(`Demoted ${target_id} in event ${event_id}`);
    } else {
      res.status(404).send(`Failed to demote ${target_id} in event ${event_id}`);
    }

  } catch (e) {
      res.status(404).send(`Failed to demote ${target_id} in event ${event_id}: ${e}`);
  }
});


/**
 * Adds a member to an event
 * @name POST/member/add
 * @function
 * @param { string } member_id 
 * @param { string } event_id
 * @returns { string } a success message if member is successfully added, an
 * error message otherwise
 */
router.post('/add', async (req, res) => {
  var member_id = req.user.uid;
  var { event_id } = req.params;
  var db = firestore();

  try {
    var eventDocRef = await db.collection(EVENTS_COLLECTION).doc(event_id).get();

    if (eventDocRef.exists) {
      console.log(EVENT_MEMBERS_COLLECTION);
      await db.collection(EVENT_MEMBERS_COLLECTION).add({
        member_id: member_id,
        event_id: event_id
      },
        // the merge: true option essentially specifies the table to add the
        // relationship if it doesn't exist in the collection already
        { merge: true });

      res.status(200).send(`Member with id ${member_id} added to even with id: ${event_id}`);
    } else {
      res.status(404).send(`Event with id ${event_id} doesn't exist!`)
    }

  } catch (e) {
    res.status(404).send(`Error ${e}`);
  }
});

/**
 * Deletes a member from an event
 * @name POST/member/:target_id
 * @function
 * @param { string } member_id 
 * @param { string } target_id id of member to delete from event
 * @param { string } event_id
 * @returns a success message if member is successfully deleted, an
 * error message otherwise
 */
router.post('/delete/:target_id', async (req, res) => {
  var member_id = req.user.uid;
  var { target_id } = req.params;
  var { event_id } = req.body;
  var db = firestore();

  try {
    const eventMemberDocRef = await db.collection(EVENT_MEMBERS_COLLECTION).where(
                              "member_id", "==", target_id).where("event_id", "==", event_id).get();

    if (!eventMemberDocRef.empty) {
      const delete_id = eventMemberDocRef.docs[0].id;

      // Remove member from event members
      var deleteRes = await db.collection(EVENT_MEMBERS_COLLECTION).doc(delete_id).delete()
      res.status(200).send(`Deleted ${target_id} in event ${event_id} from members`);
    }

   const eventAdminDocRef = await db.collection(EVENT_ADMINS_COLLECTION).where(
                              "member_id", "==", target_id).where("event_id", "==", event_id).get();

    if (!eventAdminDocRef.empty) {
      const delete_id = eventAdminDocRef.docs[0].id;

      // Remove member from event admins
      var deleteRes = await db.collection(EVENT_ADMINS_COLLECTION).doc(delete_id).delete()
      res.status(200).send(`Deleted ${target_id} in event ${event_id} from admins`);
    }

  } catch (e) {
      res.status(404).send(`Failed to delete ${target_id} in event ${event_id}: ${e}`);
  }
});


module.exports = router;