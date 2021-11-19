import React, { useEffect, useState } from 'react';

import { Typography } from '@mui/material';

import { getComment } from '../api/comments';

const CommentBubble = ({ commentID }) => {
  const [commentText, setCommentText] = useState('');
  const [commentMemberID, setCommentMemberID] = useState('');
  const [memberName, setMemberName] = useState('');

  // Fetch comment at mount
  useEffect(async () => {
    const comment = await getComment(commentID);
    setCommentText(comment.commentText);
    setCommentMemberID(comment.memberID);
  }, []);

  useEffect(async () => {
    // TODO: Query backend for member name from member ID
    setMemberName('Member Name');
  }, [commentMemberID]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: 'lightgrey',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '20px',
      outline: 'auto',
      marginBottom: '15px',
      marginLeft: '5px',
      marginRight: '5px',
      martinTop: '5px',
    }}
    >
      <Typography variant="subtitle1" sx={{ paddingLeft: '20px', minWidth: '100px' }}>
        {memberName}
        {': '}
      </Typography>
      <Typography variant="body2" sx={{ paddingRight: '20px' }}>
        {commentText}
      </Typography>
    </div>
  );
};

export default CommentBubble;
