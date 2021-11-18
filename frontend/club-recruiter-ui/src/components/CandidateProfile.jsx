import React, { useEffect, useState } from 'react';

import {
  Dialog, Card, CardContent, Typography, Button, CardActions, IconButton,
} from '@mui/material';

import '../styles/CandidateProfile.css';
import { DialogContent } from '@material-ui/core';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { getCandidate } from '../api/candidate';
import { getCommentList } from '../api/comments';
import CommentBubble from './CommentBubble';

const CandidateProfile = ({ open, candidateID, closeHandler }) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhoneNumber, setCandidatePhoneNumber] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateApplicationStatus, setCandidateApplicationStatus] = useState('');
  const [commentIDList, setCommentIDList] = useState([]);
  const [commentIndex, setCommentIndex] = useState(0);

  // Query for candidate details upon load
  useEffect(async () => {
    const currentCandidate = await getCandidate(candidateID);
    const commentList = await getCommentList(candidateID);
    setCandidateName(currentCandidate.name);
    setCandidatePhoneNumber(currentCandidate.phoneNumber);
    setCandidateEmail(currentCandidate.email);
    setCandidateApplicationStatus(currentCandidate.applicationStatus);
    setCommentIDList(commentList);
  }, []);

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
        <Button size="small" sx={{ minWidth: '100vw', minHeight: '30px' }}>Download Resume</Button>
      </CardActions>
    </Card>
  );

  return (
    <Dialog fullWidth sx={{ textAlign: 'center' }} maxWidth="sm" open={open} onBackdropClick={closeHandler}>
      <Typography variant="h5" sx={{ padding: 1 }}>
        {candidateName}
      </Typography>
      <DialogContent>
        <DetailCard />
        <Typography variant="h6" sx={{ paddingTop: 1 }}>
          Comments
        </Typography>
        {commentIndex < commentIDList.length
          ? <CommentBubble commentID={commentIDList[commentIndex]} />
          : <div />}
        {commentIndex + 1 < commentIDList.length
          ? <CommentBubble commentID={commentIDList[commentIndex + 1]} />
          : <div />}
        {commentIndex + 2 < commentIDList.length
          ? <CommentBubble commentID={commentIDList[commentIndex + 2]} />
          : <div />}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <IconButton variant="contained" onClick={() => setCommentIndex(commentIndex - 3)} disabled={commentIndex <= 0}>
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton variant="contained" onClick={() => setCommentIndex(commentIndex + 3)} disabled={commentIndex + 2 > commentIDList.length}>
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateProfile;
