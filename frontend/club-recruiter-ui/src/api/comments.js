import { auth, cloudFunctionEndpoint } from './firebase';

const getComment = async (commentID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/comment/${commentID}`, {
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

const getCommentList = async (candidateID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/comment/by_candidate/${candidateID}`, {
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
    return resJson.comment_ids;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const postComment = async (candidateID, commentText, eventID) => {
  console.log(`Posting comment for ${candidateID}: ${commentText}`);
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    candidate_id: candidateID,
    event_id: eventID,
    comment: commentText,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/comment/add`, {
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

const deleteComment = async (commentID) => {
  const user = auth.currentUser;
  const userToken = await user.getIdToken();
  const requestBody = {
    comment_id: commentID,
  };
  try {
    const response = await fetch(`${cloudFunctionEndpoint}/comment/delete`, {
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
  getComment,
  getCommentList,
  postComment,
  deleteComment,
};
