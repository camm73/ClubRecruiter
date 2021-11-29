import React from 'react';
import { Popover } from '@mui/material';

const EmailHints = ({ open, handleClose }) => (
  <Popover
    open={open}
    onClose={handleClose}
    anchorOrigin={{
      vertical: 'center',
      horizontal: 'center',
    }}
  >
    <p>The following are variables that can be used in your email template:</p>
    <ul style={{ textAlign: 'left' }}>
      <li className="feature-item">{'__{event_name}__:  Replaced with the name of an event.'}</li>
      <li className="feature-item">
        {'__{candidate_name}__:  Replaced with the name of each candidate in the sorted list to the left.'}
      </li>
      <li className="feature-item">{'__{application_status}__:  Replaced with the current application status of each candidate.'}</li>
    </ul>
  </Popover>
);

export default EmailHints;
