import React, { useEffect, useState } from 'react';

import {
  Dialog, Card, CardContent, Typography, Button, CardActions, TextField, IconButton,
} from '@mui/material';

import '../styles/CandidateProfile.css';
import { DialogContent } from '@material-ui/core';
import Close from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  getCandidate, acceptCandidate, rejectCandidate, deleteCandidate,
} from '../api/candidate';
import { getCommentList, postComment } from '../api/comments';
import { getResumeLink } from '../api/firebase';
import CommentBubble from './CommentBubble';
import ConfirmationDialog from './ConfirmationDialog';

const CandidateProfile = ({
  admin, open, candidateID, closeHandler, eventRefresh,
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhoneNumber, setCandidatePhoneNumber] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateApplicationStatus, setCandidateApplicationStatus] = useState('');
  const [candidateBiography, setCandidateBiography] = useState('');
  const [candidateResumeID, setCandidateResumeID] = useState('');
  const [commentIDList, setCommentIDList] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(async () => {});
  const { eventID } = useParams();

  // Max length of 200 characters
  const MAX_COMMENT_LENGTH = 200;

  const updateCommentList = async () => {
    if (candidateID === undefined) return;
    const commentList = await getCommentList(candidateID);
    setCommentIDList(commentList);
  };

  const viewResume = async (resumeID) => {
    const resumeLink = await getResumeLink(resumeID);
    window.open(resumeLink);
  };

  const resetModal = () => {
    setCandidateName('');
    setCandidatePhoneNumber('');
    setCandidateEmail('');
    setCandidateApplicationStatus('');
    setCandidateResumeID('');
    setCommentIDList([]);
  };

  // Query for candidate details upon load
  useEffect(async () => {
    if (candidateID === undefined || !candidateID.length) return;
    const currentCandidate = await getCandidate(candidateID);
    setCandidateName(currentCandidate.name);
    setCandidatePhoneNumber(currentCandidate.phone_number);
    setCandidateEmail(currentCandidate.email);
    setCandidateApplicationStatus(currentCandidate.application_status);
    setCandidateResumeID(currentCandidate.resume_id);
    setCandidateBiography(currentCandidate.biography);
    await updateCommentList();
  }, [candidateID]);

  const handleSubmitComment = async () => {
    await postComment(candidateID, commentText, eventID);
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
          <Typography variant="subtitle1">
            Biography:
          </Typography>
          <Typography variant="subtitle1">
            {candidateBiography}
          </Typography>
        </div>
      </CardContent>
      <CardActions sx={{
        backgroundColor: 'lightgrey', display: 'flex', justifyContent: 'center', flexDirection: 'row',
      }}
      >
        <Button
          size="small"
          style={{
            minHeight: '30px', backgroundColor: 'gray', borderRadius: '10px', padding: '10px',
          }}
          onClick={() => viewResume(candidateResumeID)}
        >
          View Resume
        </Button>
        {admin ? (
          <Button
            size="small"
            style={{
              minHeight: '30px', backgroundColor: 'red', borderRadius: '10px', padding: '10px',
            }}
            onClick={() => {
              setConfirmationAction(() => () => {
                rejectCandidate(candidateID);
                return 'rejected';
              });
              setConfirmationOpen(true);
            }}
          >
            Reject Candidate
          </Button>
        ) : <div />}
        {admin ? (
          <Button
            size="small"
            style={{
              minHeight: '30px', backgroundColor: 'green', borderRadius: '10px', padding: '10px',
            }}
            onClick={() => {
              setConfirmationAction(() => () => {
                acceptCandidate(candidateID);
                return 'accepted';
              });
              setConfirmationOpen(true);
            }}
          >
            Accept Candidate
          </Button>
        ) : <div />}
      </CardActions>
    </Card>
  );

  return (
    <div>
      <ConfirmationDialog
        open={confirmationOpen}
        closeHandler={() => setConfirmationOpen(false)}
        yesAction={() => {
          const newStatus = confirmationAction();
          setConfirmationOpen(false);
          setCandidateApplicationStatus(newStatus);
        }}
        title="Confirm Application Status Change"
        bodyText={`Are you sure you want to change the application status of candidate: ${candidateName}?`}
      />
      <Dialog
        fullWidth
        sx={{ textAlign: 'center' }}
        maxWidth="sm"
        open={open}
        onBackdropClick={() => {
          closeHandler();
          resetModal();
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', left: '10px', top: '10px' }}>
            <Button
              startIcon={<Close />}
              onClick={() => {
                closeHandler();
                resetModal();
              }}
            />
          </div>
          <Typography variant="h5" sx={{ padding: 1 }}>
            {candidateName}
          </Typography>
          {admin ? (
            <div style={{ position: 'absolute', right: '20px' }}>
              <IconButton
                onClick={async () => {
                  const deleteSuccess = await deleteCandidate(candidateID);
                  if (!deleteSuccess) {
                    alert('You are not allowed to delete this candidate.');
                    return;
                  }
                  await eventRefresh();
                  closeHandler();
                  resetModal();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ) : <div />}
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
            {commentIDList !== undefined ? commentIDList.map((currID) => (
              <CommentBubble
                admin={admin}
                key={currID}
                commentID={currID}
                refreshCommentList={updateCommentList}
              />
            )) : <div />}
          </div>
          <div style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px',
          }}
          >
            <TextField
              fullWidth
              multiline
              id="outlined-basic"
              label="Type a comment"
              value={commentText}
              variant="outlined"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSubmitComment();
                }
              }}
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
    </div>
  );
};

export default CandidateProfile;
