import { cloudFunctionEndpoint, auth } from './firebase';

/* eslint-disable no-unused-vars */
// TODO: Query backend for list of events for a member
const listMemberEvents = async (memberID) => ['123', '456', '789'];

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
    return resJson.candidate_code;
  } catch (error) {
    console.log(error);
    return '';
  }
};

const listEventMembers = async (candidateCode) => ['Tian Yu Liu', 'Wen Hong Lam'];

const listEventOrganizers = async (candidateCode) => ['Zacharye', 'Jackson', 'Rex'];

const getEventDetails = async (candidateCode) => {
  const details = {
    candidateCode,
    memberCode: 'WeLoveUSC',
    title: 'Zeta Zeta Zeta Rush',
    description: 'Fall 2021 ZZZ Rush.',
    imageLink: 'https://www.logolynx.com/images/logolynx/6c/6c7854a6d47c80ca417063d1c36fd4e9.jpeg',
  };
  return details;
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
    console.log(resJson);
    return resJson.candidate_code;
  } catch (error) {
    console.log(error);
    return '';
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  listMemberEvents,
  joinEvent,
  listEventMembers,
  listEventOrganizers,
  getEventDetails,
  createEvent,
};
