const { firestore, storage } = require("firebase-admin");
const { EVENTS_COLLECTION, CANDIDATE_CODE, EVENT_MEMBERS_COLLECTION, CLOUD_STORAGE_BUCKET_URL } = require("./constants");

/**
 * Validates a candidate_code
 * @name validateCandidateCode
 * @function
 * @param { string } candidate_code
 * @returns { boolean } true if the candidate code is valid, false otherwise
 * 
 */
async function validateCandidateCode(candidate_code) {
  candidate_code = candidate_code.toLowerCase();
  var db = firestore()
  var eventDocRef = await db.collection(EVENTS_COLLECTION)
    .where(CANDIDATE_CODE, "==", candidate_code).get();

  if (eventDocRef.empty)
    return false;

  return true;
}

/**
 * Checkes whether or not a member is the admin of an event
 * @name isAdmin
 * @function
 * @param { string } member_id
 * @param { string } event_id
 * @returns { boolean } true if member_id is an admin of event_id, false
 * otherwise 
 * 
 */
async function isAdmin(member_id, event_id) {
  var db = firestore()
  const currUserRef = await db.collection(EVENT_MEMBERS_COLLECTION)
    .where("member_id", "==", member_id)
    .where("event_id", "==", event_id)
    .where("is_admin", "==", true).get();
  if (currUserRef.empty)
    return false;

  return true;
}

/**
 * Deletes a file from Cloud Storage buckets
 * @name deleteFile
 * @function
 * @param { string } filename
 * @returns { void } Nothing
 * 
 */
async function deleteFile(filename) {
  storage().bucket(CLOUD_STORAGE_BUCKET_URL).file(filename).delete();
}

module.exports = {
  validateCandidateCode,
  isAdmin,
  deleteFile
}