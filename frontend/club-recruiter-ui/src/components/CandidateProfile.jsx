import React from 'react';

import { Dialog, DialogTitle } from '@mui/material';

const CandidateProfile = ({ open, candidateID, closeHandler }) => (
  <Dialog open={open} onBackdropClick={closeHandler}>
    <DialogTitle>
      Test Candidate
      {' '}
      {candidateID}
    </DialogTitle>
  </Dialog>
);

export default CandidateProfile;
