
var express = require('express');
const { db } = require('../db');
var router = express.Router();

/**
 * This function adds a new event candidate to the candidates database
 * @param {req} contains the candidates's eventCode, email, name, phoneNumber,
 * biography, resumeLink and other basic info.
 * @returns a status of 200 if the candidate insertion is successful, 404 if
 * not.
 */
router.post('/add', function (req, res, next) {
  try {
    var {
      eventCode, email, name, phoneNumber, biography, resumeLink,
    } = req.body;
    // const docRef = await addDoc(collection(db, 'candidates'), {
    const docRef = await db.collection("candidates").add({
      eventCode,
      email,
      name,
      phoneNumber,
      biography,
      applicationStatus: 'pending',
      resumeLink,
    });
    res.status(200).send(`Document written with ID: ${docRef.id}`);
  } catch (e) {
    res.status(404).send(`Error adding document with ID: ${docRef.id}`);
  }
});

module.exports = router;