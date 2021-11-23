import { auth, cloudFunctionEndpoint } from './firebase';

const getComment = async (commentID) => {
  console.log(commentID);
  return {
    commentText: 'This is a test comment. Test comment. Testing comment bubbles for profile page.',
    memberID: '',
  };
};

const getCommentList = async (candidateID) => {
  console.log(`Get comment list: ${candidateID}`);
  return ['123', '456', '789', '000'];
};

const postComment = async (candidateID, commentText, memberID) => {
  console.log(`Posting comment by ${memberID} for ${candidateID}: ${commentText}`);
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
