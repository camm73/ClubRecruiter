/** Express router providing events related routes
 * @module routers/events
 * @requires express
 * @requires firebase-admin
 */

var admin = require('firebase-admin');

var express = require('express');

/**
 * Express router to mount event related functions on.
 * @type {object}
 * @const
 * @namespace eventsRouter
 */
var router = express.Router();

const { EVENTS_COLLECTION, CANDIDATES_COLLECTION, CLUB_MEMBERS_COLLECTION } = require('../constants')

/**
 * Lists all events a ClubMember is a member of
 * @name get/list/:member_id
 * @function
 * @memberof module:routers/routes~eventsRouter
 * @inner
 * @param {string} member_id
 * @returns { Object[] } a list of events the ClubMember is a member of
 */
router.get('/list/:member_id', async function (req, res) {
  try {
    var { member_id } = req.params;

    var db = admin.firestore();
    const eventListRes = await db.collection(EVENTS_COLLECTION).where("member_id", "==", member_id).get();

    if (eventListRes.empty()) {
      console.log("No matching documents!");
      res.status(404).send(`Can't find member with member_id == ${member_id}`);
    }

    var eventList = [];
    eventListRes.forEach(doc => {
      eventList.push(doc.data());
      console.log(doc.id, '=>', doc.data());
    });
    res.status(200).send(eventList);
  } catch (e) {
    res.status(404).send(`Error adding document with ID: ${docRef.id}`);
  }
});


/**
 * Retrieves full detail of an event given an event_id
 * @name get/:event_id
 * @function
 * @memberof module:routers/events~eventsRouter
 * @inner
 * @param {string} event_id
 * @returns { Object } event details containing eventName, eventDescription,
 * eventCoverPictureUrl, eventCode, accessCode, list[members], list[organizers],
 * list[candidates]
 */
router.get('/:event_id', async (req, res) => {
  var { event_id } = req.params;
  var db = admin.firestore();
  try {
    var docRef = await db.collection(EVENTS_COLLECTION).doc(event_id).get();
    if (docRef.exists()) {
      res.status(200).send(data);
    } else {
      res.status(404).send(`Event with event_id: ${event_id} doesn't exist!`)
    }
  } catch (e) {
    res.status(404).send(`Error retrieving event: ${e}`)
  }
});


/**
 * Adds an event to the events database, and updates the candidates database
 * @name post/add
 * @function
 * @memberof module:routers/events~eventsRouter
 * @inner
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
  var db = admin.firestore();

  try {
    // create new event in Events db
    var eventDocRef = await db.collection(EVENTS_COLLECTION).add({
      event_name,
      event_description,
      event_cover_picture_url
    });

    // update Members db
    var memberDocRef = await db.collection(CLUB_MEMBERS_COLLECTION).doc(member_id).update({
      // add the new event's unique id to the events list
      events: admin.firestore.FieldValue.arrayUnion(eventDocRef.id)
    });

    res.status(200).send(`New event added with id: ${eventDocRef.id}`);
  } catch (e) {
    res.status(404).send(`Error adding new event: ${e}`);
  }
});


/**
 * Deletes an event from Events database
 * @name delete/delete
 * @function
 * @memberof module:routers/events~eventsRouter
 * @inner
 * @param { string } member_id and 
 * @param {string} event_id
 * @returns { string } a success message if the event delete is successful, an
 * error message otherwise
 */
router.delete('/delete', async (req, res) => {
  res.status(200).send(`Ok`);
});

module.exports = router;