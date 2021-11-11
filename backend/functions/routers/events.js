var { firestore } = require('firebase-admin');
var express = require('express');
var router = express.Router();

const { EVENTS_COLLECTION, CANDIDATES_COLLECTION, CLUB_MEMBERS_COLLECTION, MEMBERS_EVENTS_COLLECTION, ADMIN_EVENTS_COLLECTION } = require('../constants')

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
    const membersEventsRes = await db.collection(MEMBERS_EVENTS_COLLECTION).where("member_id", "==", member_id).get();
    const adminsEventsRes = await db.collection(ADMIN_EVENTS_COLLECTION).where("member_id", "==", member_id).get();

    if (eventListRes.empty() && adminsEventsRes.empty()) {
      console.log("No matching documents!");
      res.status(404).send(`Can't find member with member_id == ${member_id}`);
    }

    var eventList = [];
    membersEventsRes.forEach(doc => {
      eventList.push(doc.data().event_id);
    });

    adminsEventsRes.forEach(doc => {
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
 * @param {string} event_cover_picture_url
 * @returns { [string, string] } event_code and access_code to the frontend to
 * be distributed to ClubMembers as well as Candidates
 */
router.post('/add', async (req, res) => {
  var member_id = req.user.uid;
  var { event_name, event_description, event_cover_picture_url } = req.body;
  var db = firestore();

  try {
    // create new event in Events db
    var eventDocRef = await db.collection(EVENTS_COLLECTION).add({
      event_name,
      event_description,
      event_cover_picture_url
    });

    await db.collection(ADMIN_EVENTS_COLLECTION).add({
      member_id: member_id,
      event_id: eventDocRef.id
    })

    res.status(200).send(`New event added with id: ${eventDocRef.id}`);
  } catch (e) {
    res.status(404).send(`Error adding new event: ${e}`);
  }
});

/**
 * Adds a member to an event
 * @name POST/event/member/:event_id
 * @function
 * @param { string } member_id 
 * @param { string } event_id
 * @returns { string } a success message if member is successfully added, an
 * error message otherwise
 */
router.post('/member/:event_id', async (req, res) => {
  var member_id = req.user.uid;
  var { event_id } = req.params;
  var db = firestore();

  try {
    var eventDocRef = await db.collection(EVENTS_COLLECTION).doc(event_id).get();

    if (eventDocRef.exists) {
      await db.collection(MEMBERS_EVENTS_COLLECTION).set({
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
    res.status(404).send(e);
  }
});

/**
 * Deletes a member from an event
 * @name DELETE/event/member/:event_id
 * @function
 * @param { string } member_id 
 * @param { string } event_id
 * @returns a success message if member is successfully deleted, an
 * error message otherwise
 */
router.delete('/member/:event_id', async (req, res) => {
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