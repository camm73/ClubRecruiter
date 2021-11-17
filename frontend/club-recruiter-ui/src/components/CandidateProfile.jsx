import React, { useEffect, useState } from 'react';

import {
  Dialog, DialogTitle, Card, CardContent, Typography, Button, CardActions,
} from '@mui/material';

import '../styles/CandidateProfile.css';
import { DialogContent } from '@material-ui/core';

import { getCandidate } from '../api/candidate';

const CandidateProfile = ({ open, candidateID, closeHandler }) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhoneNumber, setCandidatePhoneNumber] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateApplicationStatus, setCandidateApplicationStatus] = useState('');

  // Query for candidate details upon load
  useEffect(async () => {
    const currentCandidate = await getCandidate(candidateID);
    setCandidateName(currentCandidate.name);
    setCandidatePhoneNumber(currentCandidate.phoneNumber);
    setCandidateEmail(currentCandidate.email);
    setCandidateApplicationStatus(currentCandidate.applicationStatus);
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
        <Button size="small" sx={{ minWidth: '100vw' }}>Download Resume</Button>
      </CardActions>
    </Card>
  );

  return (
    <Dialog fullWidth sx={{ textAlign: 'center' }} maxWidth="sm" open={open} onBackdropClick={closeHandler}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {candidateName}
      </DialogTitle>
      <DialogContent>
        <DetailCard />
        <h2>Comments</h2>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateProfile;
