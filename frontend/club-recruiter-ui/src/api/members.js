import { auth, cloudFunctionEndpoint } from './firebase';

const getMember = async (memberID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/member/${memberID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.status !== 200) {
      const errorText = await response.text();
      console.log(errorText);
      return false;
    }
    const resJson = await response.json();
    return resJson;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const promoteMember = async (targetID, eventID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    event_id: eventID,
    target_id: targetID,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/member/promote`, {
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

const demoteMember = async (targetID, eventID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    event_id: eventID,
    target_id: targetID,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/member/demote`, {
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

const removeMember = async (targetID, eventID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    event_id: eventID,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/member/delete/${targetID}`, {
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
  getMember,
  promoteMember,
  demoteMember,
  removeMember,
};
