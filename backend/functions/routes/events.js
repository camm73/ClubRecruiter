var admin = require('firebase-admin');
var express = require('express');
var router = express.Router();

/**
 * This function adds a new event candidate to the candidates database
 * @param {req} contains a ClubMember's userID
 * @returns a list of events the ClubMember is a *member* of
 */
router.get('/list', async function (req, res, next) {
  try {
    var member_id = req.params.member_id;

    var db = admin.firestore();
    const eventListRes = await db.collection("events").where("member_id", "==", member_id).get();

    eventListRes.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  } catch (e) {
    res.status(404).send(`Error adding document with ID: ${docRef.id}`);
  }
});

module.exports = router;