import { auth, cloudFunctionEndpoint } from './firebase';

const submitCandidateApplication = async (
  candidateCode, email, name, phoneNumber, biography, resumeID,
) => {
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
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/candidate/validate?candidate_code=${candidateCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/candidate/${candidateID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.status !== 200) {
      const errorText = await response.text();
      console.log(errorText);
      return {};
    }
    const resJson = await response.json();
    return resJson;
  } catch (error) {
    console.log(error);
    return false;
  }
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

const getEventCandidates = async (eventID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/candidate/by_event/${eventID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200) {
      const errorText = await response.text();
      console.log(errorText);
      return [];
    }
    const resJson = await response.json();
    return resJson.candidate_ids;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const deleteCandidate = async (candidateID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    candidate_id: candidateID,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/candidate/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (response.status !== 200) {
      const errorText = await response.text();
      console.log(errorText);
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  validateCandidateCode,
  getCandidate,
  submitCandidateApplication,
  acceptCandidate,
  rejectCandidate,
  getEventCandidates,
  deleteCandidate,
};
