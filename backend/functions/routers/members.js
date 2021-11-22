const express = require('express');
const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const { EVENTS_COLLECTION, EVENT_MEMBERS_COLLECTION, CLUB_MEMBERS_COLLECTION } = require('../constants');
const { isAdmin } = require('../util');

var router = express.Router();

/**
 * Gets a member's detail given its id
 * @name GET/member/:member_id
 * @function
 * @param { string } member_id
 * @returns { Object } member detail with member_id
 * 
 */
router.get('/:member_id', async function (req, res) {
  var { member_id } = req.params;

  try {
    const memberRecord = await admin.auth().getUser(member_id);

    res.status(200).send(memberRecord);
  } catch (e) {
    res.status(404).send(`Error retrieving member: ${e}`);
  }
});

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

    if (!isAdmin(member_id, event_id)) {
      res.status(404).send(`Current user is not authorized to promote members!`);
      return;
    }

    const eventMemberDocRef = await db.collection(EVENT_MEMBERS_COLLECTION).where(
      "member_id", "==", target_id).where("event_id", "==", event_id).get();

    if (!eventMemberDocRef.empty) {
      const eventMemberID = eventMemberDocRef.docs[0].id;

      // Add member to event admins
      await db.collection(EVENT_MEMBERS_COLLECTION).doc(eventMemberID).update({
        is_admin: true
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
    if (!isAdmin(member_id, event_id)) {
      res.status(404).send(`Current user is not authorized to promote members!`);
      return;
    }

    const eventMemberDocRef = await db.collection(EVENT_MEMBERS_COLLECTION).where(
      "member_id", "==", target_id).where("event_id", "==", event_id).get();

    if (!eventMemberDocRef.empty) {
      const eventMemberID = eventMemberDocRef.docs[0].id;

      // Add member to event admins
      await db.collection(EVENT_MEMBERS_COLLECTION).doc(eventMemberID).update({
        is_admin: false
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
    if (!isAdmin(member_id, event_id)) {
      res.status(404).send(`Current user is not authorized to add members!`);
      return;
    }

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
    if (!isAdmin(member_id, event_id)) {
      res.status(404).send(`Current user is not authorized to delete members!`);
      return;
    }

    var deleteRef = await db.collection(EVENT_MEMBERS_COLLECTION)
      .where("member_id", "==", target_id).where("event_id", "==", event_id).get();

    if (deleteRef.empty) {
      res.status(404).send(`No relationship with member id: ${member_id} and event id: ${event_id} exists!`);
      return;
    }

    deleteRef.forEach((member) => {
      member.ref.delete();
    });

    res.status(200).send(`Successfully deleted member with id: ${member_id} from event: ${event_id}`)

  } catch (e) {
    res.status(404).send(`Failed to delete ${target_id} in event ${event_id}: ${e}`);
  }
});


module.exports = router;