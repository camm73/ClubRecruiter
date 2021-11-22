import { auth, cloudFunctionEndpoint } from './firebase';

const submitCandidateApplication = async (
  candidateCode, email, name, phoneNumber, biography, resumeID,
) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    candidate_code: candidateCode,
    email,
    name,
    phone_number: phoneNumber,
    biography,
    resume_id: resumeID,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/candidate/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (response.status === 200) {
      return 'Successfully submitted application!';
    }
    const errorText = await response.text();
    console.log(errorText);
    return errorText;
  } catch (error) {
    console.log(error);
    return 'An error occurred submitting your application. Please try again later.';
  }
};

const validateCandidateCode = async (candidateCode) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/candidate/validate?candidate_code=${candidateCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.status === 200) {
      const resJson = await response.json();
      return resJson.valid;
    }
    const errorText = await response.text();
    console.log(errorText);
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
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

const setCandidateStatus = async (candidateID, statusValue) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    candidate_id: candidateID,
    status: statusValue,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/candidate/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (response.status === 200) {
      return true;
    }
    const errorText = await response.text();
    console.log(errorText);
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const acceptCandidate = async (candidateID) => {
  const statusRes = await setCandidateStatus(candidateID, 'accepted');
  return statusRes;
};

const rejectCandidate = async (candidateID) => {
  const statusRes = await setCandidateStatus(candidateID, 'rejected');
  return statusRes;
};

export {
  // eslint-disable-next-line import/prefer-default-export
  validateCandidateCode,
  getCandidate,
  submitCandidateApplication,
  acceptCandidate,
  rejectCandidate,
};
