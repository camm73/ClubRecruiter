var admin = require('firebase-admin');
var express = require('express');
var router = express.Router();

const { EVENTS_COLLECTION } = require('../constants')

/**
 * Lists all events a ClubMember is a member of
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
 * @param {req} contains eventID
 * @returns { Object } event details containing eventName, eventDescription,
 * eventCoverPictureUrl, eventCode, accessCode, list[members], list[organizers],
 * list[candidates]
 */
router.get('/:eventid', async (req, res) => {
  res.status(200).send(`Ok: ` + req.params.eventid);
});


/**
 * Adds an event to the events database
 * @param { string } member_id
 * @param {string} event_name
 * @param {string } event_description
 * @param {string} event_cover_picture_url
 * @returns { [string, string] } event_code and access_code to the frontend to
 * be distributed to ClubMembers as well as Candidates
 */
router.post('/add', async (req, res) => {
  res.status(200).send(`Ok`);
});


/**
 * Deletes an event from Events database
 * @param { string } member_id and 
 * @param {string} event_id
 * @returns { string } a success message if the event delete is successful, an
 * error message otherwise
 */
router.delete('/delete', async (req, res) => {
  res.status(200).send(`Ok`);
});

module.exports = router;