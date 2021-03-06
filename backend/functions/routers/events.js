const app = require("../express_generator")();
var { firestore } = require('firebase-admin');
var crypto = require('crypto');

const { EVENTS_COLLECTION, EVENT_MEMBERS_COLLECTION, CODE_LENGTH, MEMBER_CODE, CANDIDATE_CODE, CLUB_MEMBERS_COLLECTION, CANDIDATES_COLLECTION, COMMENTS_COLLECTION, CLOUD_STORAGE_BUCKET_URL } = require('../constants');
const { validateFirebaseIdToken } = require('../auth');
const { isAdmin, deleteFile } = require('../util');

async function getEventMembers(event_id, is_admin) {
  var db = firestore();
  var eventMemberRef = await db.collection(EVENT_MEMBERS_COLLECTION)
    .where("event_id", "==", event_id)
    .where('is_admin', "==", is_admin)
    .get();

  var member_id_list = [];
  eventMemberRef.forEach((doc) => {
    member_id_list.push(doc.data().member_id)
  });

  return member_id_list;
}

/**
 * Checks whether or not the current member is an admin of the given event
 * @name GET/event/is_admin
 * @function
 * @param {string} member_id unique id of member in event
 * @param {string} event_id unique id of event
 * @returns { Object } 200 success message with object containing boolean is_admin field.
 * is_admin takes on value based on whether user is an event of given event.
 * Retursn 404 with error message otherwise.
 * false otherwise
 */
app.get('/is_admin', validateFirebaseIdToken, async (req, res) => {
  var member_id = req.user.uid;
  var { event_id } = req.query;

  var is_admin = await isAdmin(member_id, event_id);
  res.status(200).send({
    is_admin: is_admin
  });
});


/**
 * Lists all events a ClubMember is a member of
 * @name GET/event/by_member
 * @function
 * @param {string} member_id unique id of member in event
 * @returns { Object } 200 success message with object containing a list of 
 * event_id's the ClubMember is a member or admin of. 
 * Returns 404 with error message otherwise.
 */
app.get('/by_member', validateFirebaseIdToken, async function (req, res) {
  try {
    var member_id = req.user.uid;

    var db = firestore();
    const membersEventsRes = await db.collection(EVENT_MEMBERS_COLLECTION).where("member_id", "==", member_id).get();

    if (membersEventsRes.empty) {
      console.log("No matching documents!");
      res.status(404).send(`Can't find member with member_id ${member_id}`);
      return;
    }

    var eventList = [];
    membersEventsRes.forEach(doc => {
      eventList.push(doc.data().event_id);
    });

    res.status(200).send(eventList);
  } catch (e) {
    res.status(404).send(`Error finding events by member: ${e}`);
  }
});


/**
 * Retrieves full detail of an event given an event_id
 * @name GET/event/:event_id
 * @function
 * @param {string} event_id unique id of event
 * @returns { Object } 200 success message with object containing the following event details:
 * eventName, eventDescription,
 * eventCoverPictureUrl, eventCode, accessCode, list of members, list of organizers,
 * list of candidates.
 * Returns 404 with error message otherwise.
 */
app.get('/:event_id', async (req, res) => {
  var { event_id } = req.params;
  var db = firestore();
  try {
    var docRef = await db.collection(EVENTS_COLLECTION).doc(event_id).get();
    if (docRef.exists) {
      var data = docRef.data();
      data.members = await getEventMembers(event_id, false);
      data.admins = await getEventMembers(event_id, true);
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
 * @name POST/event/create
 * @function
 * @param { string } member_id unique id of member in event
 * @param {string} event_name name of event
 * @param {string } event_description description of event
 * @param {string} event_cover_pic_id id of uploaded event cover picture
 * @returns { Object } 200 success message with object containing the following fields:
 * event name, event id, member code, candidate code.
 * Returns 404 with error message otherwise.
 */
app.post('/create', validateFirebaseIdToken, async (req, res) => {
  var member_id = req.user.uid;
  var { event_name, event_description, event_cover_pic_id } = req.body;

  if (!event_cover_pic_id)
    event_cover_pic_id = "";

  var db = firestore();

  try {
    var curr_timestamp = Date.now().toString();
    var shasum = crypto.createHash("sha1");
    var hash = shasum.update(curr_timestamp, "utf-8").digest("hex");

    // first 6 characters of the hash
    var candidate_code = hash.substr(0, CODE_LENGTH);

    // last 6 characters of the hash 
    var member_code = hash.substr(hash.length - CODE_LENGTH);


    // create new event in Events db
    var eventDocRef = await db.collection(EVENTS_COLLECTION).add({
      name: event_name,
      description: event_description,
      cover_pic_id: event_cover_pic_id,
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
 * @param { string } member_id unique id of member in event
 * @param { string } member_code member code of the target event to join
 * @returns { Object } 200 success message with object containing id of the joined event.
 * Returns 404 with error message otherwise.
 */
app.post('/member_join', validateFirebaseIdToken, async (req, res) => {
  var member_id = req.user.uid;
  var { member_code } = req.body;
  var db = firestore();

  member_code = member_code.toLowerCase();

  try {
    var eventDocRef = await db
      .collection(EVENTS_COLLECTION)
      .where(MEMBER_CODE, "==", member_code).get();

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
        event_id: event_id
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
 * Admin adds member to a given event
 * @name POST/event/member_add
 * @function
 * @param { string } member_id unique id of member in event
 * @param { string } event_id unique id of event
 * @param { string } target_id id of member to be added to event
 * @returns { Object } 200 success message with object containing id of event that member
 * has been added to. Returns 404 with error message otherwise.
 */
app.post('/member_add', validateFirebaseIdToken, async (req, res) => {
  var member_id = req.user.uid;
  var { event_id, target_id } = req.body;
  var db = firestore();


  try {
    if (!(await (isAdmin(member_id, event_id)))) {
      res.status(404).send("The current member is not an admin of the event!");
      return;
    }

    // Check if the database already has an existing document
    var memberEventRef = await db
      .collection(EVENT_MEMBERS_COLLECTION)
      .where("member_id", "==", target_id)
      .where("event_id", "==", event_id)
      .get();

    if (!memberEventRef.empty) {
      res.status(404).send(`Cannot add member to an event that they've already joined!`);
      return;
    }

    await db.collection(EVENT_MEMBERS_COLLECTION).add({
      member_id: member_id,
      event_id: event_id,
      is_admin: false,
    });

    res.status(200).send({
      event_id: event_id
    });
    return;

  } catch (e) {
    res.status(404).send(e);
    return;
  }
});

/**
 * Deletes a member from an event
 * @name DELETE/event/delete_member
 * @function
 * @param { string } target_id id of member to be deleted from event
 * @param { string } event_id unique id of event
 * @returns { string } 200 success message if member is successfully deleted.
 * Returns 404 with error message otherwise.
 */
app.delete('/delete_member', validateFirebaseIdToken, async (req, res) => {
  var member_id = req.user.uid;
  var { target_id, event_id } = req.body;
  try {
    if (!(await (isAdmin(member_id, event_id)))) {
      res.status(404).send("The current member is not an admin of the event!");
      return;
    }

    var db = firestore();
    var eventMemberDocRef = await db.collection(EVENT_MEMBERS_COLLECTION)
      .where("member_id", "==", target_id)
      .where("event_id", "==", event_id).get();

    eventMemberDocRef.forEach((event_member) => {
      event_member.ref.delete();
    })

    res.status(200).send("Member deleted successfully!");
  } catch (e) {
    res.status(404).send(`Error: ${e}`);
  }

});

/**
 * Deletes an event from Events database
 * @name DELETE/event/delete
 * @function
 * @param { string } member_id unique id of member in event 
 * @param {string} event_id unique id of event
 * @returns { string } 200 success message if the event delete is successful.
 * Returns 404 with error message otherwise
 */
app.delete('/delete', validateFirebaseIdToken, async (req, res) => {
  var member_id = req.user.uid;
  var { event_id } = req.body;
  var db = firestore();

  if (!(await isAdmin(member_id, event_id))) {
    res.status(404).send(`Non-admin cannot delete an event!`);
    return;
  }

  try {
    // delete all entries in the ClubMembers_Events collection 
    // delete all candidates under the event
    // delete all comments under this event
    // Finally, delete the event from Events collection
    var eventMemberRef = await db.collection(EVENT_MEMBERS_COLLECTION)
      .where("event_id", "==", event_id)
      .get();

    eventMemberRef.forEach((doc) => {
      doc.ref.delete();
    });

    var eventRef = db.collection(EVENTS_COLLECTION)
      .doc(event_id);

    var candidate_code = (await eventRef.get()).data().candidate_code;

    var candidateRef = await db.collection(CANDIDATES_COLLECTION)
      .where(CANDIDATE_CODE, "==", candidate_code)
      .get();

    candidateRef.forEach(async (doc) => {
      deleteFile(`resume/${doc.data().resume_id}`);
      doc.ref.delete();
    });

    var commentRef = await db.collection(COMMENTS_COLLECTION)
      .where("event_id", "==", event_id)
      .get();

    commentRef.forEach((doc) => {
      doc.ref.delete();
    })

    var event_cover_pic_id = (await eventRef.get()).data().cover_pic_id;
    deleteFile(`eventCoverPhoto/${event_cover_pic_id}`);

    eventRef.delete();
    res.status(200).send("Delete success!");

  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = app;
