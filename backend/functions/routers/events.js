var { firestore } = require('firebase-admin');
var admin = require('firebase-admin');
var express = require('express');
var router = express.Router();
var crypto = require('crypto')
var shasum = crypto.createHash("sha1")

const { EVENTS_COLLECTION, EVENT_MEMBERS_COLLECTION, CODE_LENGTH, MEMBER_CODE, CANDIDATE_CODE } = require('../constants');
const { validateFirebaseIdToken } = require('../auth');

/**
 * Lists all events a ClubMember is a member of
 * @name GET/event/list/:member_id
 * @function
 * @param {string} member_id
 * @returns { Object[] } a list of events the ClubMember is a member or admin of
 */
router.get('/list/:member_id', async function (req, res) {
  try {
    var { member_id } = req.params;

    var db = firestore();
    const membersEventsRes = await db.collection(EVENT_MEMBERS_COLLECTION).where("member_id", "==", member_id).get();

    if (membersEventsRes.empty) {
      console.log("No matching documents!");
      res.status(404).send(`Can't find member with member_id == ${member_id}`);
      return;
    }

    var eventList = [];
    membersEventsRes.forEach(doc => {
      eventList.push(doc.data().event_id);
    });

    res.status(200).send(eventList);
  } catch (e) {
    res.status(404).send(`Error adding document with ID: ${docRef.id}`);
  }
});


/**
 * Retrieves full detail of an event given an event_id
 * @name GET/event/:event_id
 * @function
 * @param {string} event_id
 * @returns { Object } event details containing eventName, eventDescription,
 * eventCoverPictureUrl, eventCode, accessCode, list[members], list[organizers],
 * list[candidates]
 */
router.get('/:event_id', async (req, res) => {
  var { event_id } = req.params;
  var db = firestore();
  try {
    var docRef = await db.collection(EVENTS_COLLECTION).doc(event_id).get();
    if (docRef.exists) {
      res.status(200).send(docRef.data());
    } else {
      res.status(404).send(`Event with event_id: ${event_id} doesn't exist!`)
    }
  } catch (e) {
    res.status(404).send(`Error retrieving event: ${e}`)
  }
});


/**
 * Adds an event to the events database, and updates the candidates database
 * @name POST/event/add
 * @function
 * @param { string } member_id
 * @param {string} event_name
 * @param {string } event_description
 * @param {string} event_cover_pic_url
 * @returns { [string, string] } candidate_code and member_code to the frontend to
 * be distributed to ClubMembers as well as Candidates
 */
router.post('/add', async (req, res) => {
  var member_id = req.user.uid;
  var { event_name, event_description, event_cover_pic_url } = req.body;
  var db = firestore();

  try {
    var curr_timestamp = Date.now().toString();
    var hash = shasum.update(curr_timestamp, "utf-8").digest("hex");

    // first 6 characters of the hash
    var candidate_code = hash.substr(0, CODE_LENGTH);

    // last 6 characters of the hash 
    var member_code = hash.substr(hash.length - CODE_LENGTH);


    // create new event in Events db
    var eventDocRef = await db.collection(EVENTS_COLLECTION).add({
      name: event_name,
      description: event_description,
      cover_pic_url: event_cover_pic_url,
      member_code: member_code,
      candidate_code: candidate_code,
      candidates: [], // list of empty candidates
    });

    await db.collection(EVENT_MEMBERS_COLLECTION).add({
      member_id: member_id,
      event_id: eventDocRef.id,
      is_admin: true,
    })

    res.status(200).send({
      event_name: event_name,
      event_id: eventDocRef.id,
      member_code: member_code,
      candidate_code: candidate_code
    });
  } catch (e) {
    res.status(404).send(`Error adding new event: ${e}`);
  }
});

/**
 * A member joins an event given the member_code
 * @name POST/event/member_join
 * @function
 * @param { string } member_id 
 * @param { string } member_code
 * @returns { string } the candidate code of the event if successful, an
 * error message otherwise
 */
router.post('/member_join', async (req, res) => {
  var member_id = req.user.uid;
  var { member_code } = req.body;
  var db = firestore();

  try {
    var eventDocRef = await db
      .collection(EVENTS_COLLECTION)
      .where(MEMBER_CODE, "==", member_code).get();

    var event = eventDocRef.docs[0];
    var event_id = eventDocRef.docs[0].id;

    // Check if the database already has an existing document
    var memberEventRef = await db
      .collection(EVENT_MEMBERS_COLLECTION)
      .where("member_id", "==", member_id)
      .where("event_id", "==", event_id)
      .get();

    if (!memberEventRef.empty) {
      res.status(404).send(`Member cannot join an event that they've already joined!`);
      return;
    }

    if (!eventDocRef.empty) {
      await db.collection(EVENT_MEMBERS_COLLECTION).add({
        member_id: member_id,
        event_id: event_id,
        is_admin: false,
      });

      res.status(200).send({
        candidate_code: event.data()[CANDIDATE_CODE]
      });
      return;
    } else {
      res.status(404).send(`Event with id ${event_id} doesn't exist or Incorrect member code!`)
      return;
    }

  } catch (e) {
    res.status(404).send(e);
    return;
  }
});



/**
 * Deletes a member from an event
 * @name DELETE/event/delete_member
 * @function
 * @param { string } target_id 
 * @param { string } event_id
 * @returns a success message if member is successfully deleted, an
 * error message otherwise
 */
router.delete('/delete_member', async (req, res) => {
  res.status(200).send(`Ok`);
});



/**
 * Deletes an event from Events database
 * @name DELETE/event/delete
 * @function
 * @param { string } member_id and 
 * @param {string} event_id
 * @returns { string } a success message if the event delete is successful, an
 * error message otherwise
 */
router.delete('/delete', async (req, res) => {
  res.status(200).send(`Ok`);
});

module.exports = router;