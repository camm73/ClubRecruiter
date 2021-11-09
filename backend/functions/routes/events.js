var admin = require('firebase-admin');
var express = require('express');
var router = express.Router();

const { EVENTS_COLLECTION } = require('../constants')

/**
 * This function adds a new event candidate to the candidates database
 * @param {req} contains a ClubMember's userID
 * @returns a list of events the ClubMember is a *member* of
 */
router.get('/list', async function (req, res) {
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

module.exports = router;