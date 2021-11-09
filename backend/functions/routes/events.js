var admin = require('firebase-admin');
var express = require('express');
var router = express.Router();

/**
 * This function adds a new event candidate to the candidates database
 * @param {req} contains a memberID
 * @returns a list of events the ClubMember is a *member* of
 */
router.get('/list', async function (req, res) {
  try {
    var { member_id } = req.params;

    var db = admin.firestore();
    const eventListRes = await db.collection("events").where("member_id", "==", member_id).get();

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
 * This function adds an event to the events database
 * @param {req} contains memberID, eventName, eventDescription,
 * eventCoverPictureUrl, eventCode, accessCode
 * @returns a status of 200 if the event create is successful, else 404
 */
router.post('/add', async (req, res) => {
  res.status(200).send(`Ok`);
});


/**
 * This function deletes an event from events database
 * @param {req} contains memberID and an eventID
 * @returns a status of 200 if the event delete is successful, else 404
 */
router.delete('/delete', async (req, res) => {
  res.status(200).send(`Ok`);
});


/**
 * This function adds a member to an event
 * @param {req} contains memberID and an eventID
 * @returns a status of 200 if the event delete is successful, else 404
 */
router.post('/member/add', async (req, res) => {
  res.status(200).send(`Ok`);
});


/**
 * This function deletes a member from an event
 * @param {req} contains memberID and an eventID
 * @returns a status of 200 if the member delete is successful, else 404
 */
router.delete('/member/delete', async (req, res) => {
  res.status(200).send(`Ok`);
});

/**
 * This function promotes an existing member of an event to organizer
 * @param {req} contains memberID and an eventID
 * @returns a status of 200 if the promotion is successful, else 404
 */
router.put('/member/promote', async (req, res) => {
  res.status(200).send(`Ok`);
});

/**
 * This function demotes an existing member of an event to regular member
 * @param {req} contains memberID and an eventID
 * @returns a status of 200 if the demotion is successful, else 404
 */
router.put('/member/demote', async (req, res) => {
  res.status(200).send(`Ok`);
});


module.exports = router;