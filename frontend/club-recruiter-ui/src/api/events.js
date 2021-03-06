import { cloudFunctionEndpoint, auth } from './firebase';

/* eslint-disable no-unused-vars */
// TODO: Query backend for list of events for a member
const listMemberEvents = async () => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/event/by_member`, {
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
    return resJson;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const joinEvent = async (memberCode) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    member_code: memberCode,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/event/member_join`, {
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
      return '';
    }
    const resJson = await response.json();
    return resJson.event_id;
  } catch (error) {
    console.log(error);
    return '';
  }
};

const getEventDetails = async (eventID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/event/${eventID}`, {
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
    return {};
  }
};

const createEvent = async (eventName, eventDescription, coverPicName) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    event_name: eventName,
    event_description: eventDescription,
    event_cover_pic_id: coverPicName,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/event/create/`, {
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
      return '';
    }
    const resJson = await response.json();
    return resJson.event_id;
  } catch (error) {
    console.log(error);
    return '';
  }
};

const deleteEvent = async (eventID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    event_id: eventID,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/event/delete`, {
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

const isAdmin = async (eventID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/event/is_admin?event_id=${eventID}`, {
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
    return resJson.is_admin;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  listMemberEvents,
  joinEvent,
  getEventDetails,
  createEvent,
  deleteEvent,
  isAdmin,
};
