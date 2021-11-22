import { cloudFunctionEndpoint } from './firebase';


* @param { string } candidate_code
* @param { string } email
* @param { string } name
* @param { string } phone_number
* @param { string } biography
* @param { string } resume_id

const submitCandidateApplication = async (candidateCode, email, name, phoneNumber, biography, resumeID) => {

}

const validateCandidateCode = async (candidateCode) => {
  // TODO: Verify code with backend
  console.log(`Validating candidate code: ${candidateCode}`);
  return true;
};

// Get candidate details using candidateID
const getCandidate = async (candidateID) => {
  console.log(`Getting ID: ${candidateID}`);
  const candidateName = 'FirstName LastName';
  const candidateEmail = 'test@example.com';
  const candidatePhoneNumber = '123-456-7890';
  const candidateApplicationStatus = 'Pending';
  const candidateResumeID = 'ID';

  return {
    name: candidateName,
    email: candidateEmail,
    phoneNumber: candidatePhoneNumber,
    applicationStatus: candidateApplicationStatus,
    resumeID: candidateResumeID,
  };
};

export {
  // eslint-disable-next-line import/prefer-default-export
  validateCandidateCode,
  getCandidate,
};
