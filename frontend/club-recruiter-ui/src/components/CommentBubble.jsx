import React, { useEffect, useState } from 'react';

import { Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { getMember } from '../api/members';
import { getComment, deleteComment } from '../api/comments';
import ConfirmationDialog from './ConfirmationDialog';

const CommentBubble = ({ commentID, refreshCommentList }) => {
  const [commentText, setCommentText] = useState('');
  const [commentMemberID, setCommentMemberID] = useState('');
  const [memberName, setMemberName] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(async () => {});

  // Fetch comment at mount
  useEffect(async () => {
    const comment = await getComment(commentID);
    setCommentText(comment.comment);
    setCommentMemberID(comment.member_id);
  }, []);

  useEffect(async () => {
    // Query backend for member name from member ID
    const memberDetails = await getMember(commentMemberID);
    setMemberName(memberDetails.displayName);
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
      <ConfirmationDialog
        open={confirmationOpen}
        closeHandler={() => setConfirmationOpen(false)}
        yesAction={() => {
          confirmationAction();
          setConfirmationOpen(false);
        }}
        title="Confirm Deletion"
        bodyText="Are you sure you want to delete this comment?"
      />
      <Typography variant="subtitle1" sx={{ paddingLeft: '20px', minWidth: '100px' }}>
        {memberName}
        {': '}
      </Typography>
      <Typography variant="body2" sx={{ paddingRight: '20px' }}>
        {commentText}
      </Typography>
      <IconButton onClick={() => {
        setConfirmationAction(() => () => {
          deleteComment(commentID);
          refreshCommentList();
        });
        setConfirmationOpen(true);
      }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default CommentBubble;
