import React, { useEffect, useState } from 'react';

import {
  Dialog, Card, CardContent, Typography, Button, CardActions, TextField,
} from '@mui/material';

import '../styles/CandidateProfile.css';
import { DialogContent } from '@material-ui/core';
import Close from '@mui/icons-material/Close';

import { getCandidate } from '../api/candidate';
import { getCommentList, postComment } from '../api/comments';
import CommentBubble from './CommentBubble';

const CandidateProfile = ({ open, candidateID, closeHandler }) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhoneNumber, setCandidatePhoneNumber] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateApplicationStatus, setCandidateApplicationStatus] = useState('');
  const [candidateResumeID, setCandidateResumeID] = useState('');
  const [commentIDList, setCommentIDList] = useState([]);
  const [commentText, setCommentText] = useState('');

  // Max length of 200 characters
  const MAX_COMMENT_LENGTH = 200;

  // Query for candidate details upon load
  useEffect(async () => {
    const currentCandidate = await getCandidate(candidateID);
    const commentList = await getCommentList(candidateID);
    setCandidateName(currentCandidate.name);
    setCandidatePhoneNumber(currentCandidate.phoneNumber);
    setCandidateEmail(currentCandidate.email);
    setCandidateApplicationStatus(currentCandidate.applicationStatus);
    setCandidateResumeID(currentCandidate.resumeID);
    setCommentIDList(commentList);
  }, []);

  const updateCommentList = async () => {
    const commentList = await getCommentList(candidateID);
    setCommentIDList(commentList);
  };

  const downloadResume = (resumeID) => {
    console.log(`Downloading resume: ${resumeID}`);
  };

  const handleSubmitComment = async () => {
    await postComment(candidateID, commentText, 'memberID');
    setCommentText('');
    await updateCommentList();
  };

  const DetailCard = () => (
    <Card sx={{ minWidth: 275, backgroundColor: '#FCDDEC' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <div className="detail-column">
          <Typography variant="subtitle1">
            Email:
            {' '}
            {candidateEmail}
          </Typography>
          <Typography variant="subtitle1">
            Phone Number:
            {' '}
            {candidatePhoneNumber}
          </Typography>
          <Typography variant="subtitle1">
            Application Status:
            {' '}
            {candidateApplicationStatus}
          </Typography>
        </div>
      </CardContent>
      <CardActions sx={{ backgroundColor: 'lightgrey', display: 'flex', justifyContent: 'center' }}>
        <Button size="small" sx={{ minWidth: '100vw', minHeight: '30px' }} onClick={() => downloadResume(candidateResumeID)}>Download Resume</Button>
      </CardActions>
    </Card>
  );

  return (
    <Dialog fullWidth sx={{ textAlign: 'center' }} maxWidth="sm" open={open} onBackdropClick={closeHandler}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', left: '10px', top: '10px' }}>
          <Button startIcon={<Close />} onClick={closeHandler} />
        </div>
        <Typography variant="h5" sx={{ padding: 1 }}>
          {candidateName}
        </Typography>
      </div>
      <DialogContent>
        <DetailCard />
        <Typography variant="h6" sx={{ paddingTop: 1 }}>
          Comments
        </Typography>
        <div style={{
          overflowX: 'hidden', overflowY: 'auto', height: '200px', paddingTop: '5px',
        }}
        >
          {commentIDList.map((currID) => (
            <CommentBubble commentID={currID} />
          ))}
        </div>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px',
        }}
        >
          <TextField
            fullWidth
            multiline
            id="outlined-basic"
            label="Outlined"
            value={commentText}
            variant="outlined"
            onChange={(e) => {
              if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                setCommentText(e.target.value);
              }
            }}
          />
          <Button
            style={{
              display: 'flex',
              borderRadius: '20px',
              backgroundColor: 'lightgray',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '10px',
            }}
            onClick={handleSubmitComment}
          >
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateProfile;
