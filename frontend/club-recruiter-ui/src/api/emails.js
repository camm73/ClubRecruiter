import { auth, cloudFunctionEndpoint } from './firebase';

const sendEmail = async (emailSubject, emailBody, eventID, candidateIDs) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    email_subject: emailSubject,
    email_body: emailBody,
    event_id: eventID,
    candidate_ids: candidateIDs,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/email`, {
      method: 'POST',
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
  sendEmail,
};
