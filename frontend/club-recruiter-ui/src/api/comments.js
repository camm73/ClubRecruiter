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

export {
  // eslint-disable-next-line import/prefer-default-export
  getComment,
  getCommentList,
  postComment,
};
