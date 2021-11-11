import { TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

import '../styles/MemberDashboard.css';

const MemberDashboard = () => {
  const [eventCode, setEventCode] = useState('');

  const handleJoinEvent = () => {

  };

  return (
    <div className="dashboard">
      <Header pageName="Member Dashboard" />
      <div className="join-event">
        <div className="event-code-wrapper">
          <TextField className="event-code-field" fullWidth id="outlined-basic" value={eventCode} label="Event Code" variant="outlined" onChange={(e) => setEventCode(e.target.value)} />
        </div>
        <Button variant="contained" startIcon={<AddIcon />} disabled={eventCode.length === 0} onClick={handleJoinEvent}>Join Event</Button>
      </div>
      <div className="event-list">
        <EventCard clickAction={() => {}} />
      </div>
    </div>
  );
};

export default MemberDashboard;
