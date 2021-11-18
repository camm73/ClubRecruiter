const getComment = async (commentID) => {
  console.log(commentID);
  return {
    commentText: 'This is a test comment. Test comment. Testing. Nlahlskdsf lajdsflkasdf aslkfdjalksjdf dfjslkf sldfksdf lsdkfdskl sdf sldf akl dfkla dsklf kljdsflkasdflkdsf lasf sdf adlkf fl',
    memberID: '',
  };
};

const getCommentList = async (candidateID) => {
  console.log(`Get comment list: ${candidateID}`);
  return ['123', '456', '789', '000'];
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getComment,
  getCommentList,
};
