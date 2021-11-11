import { TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

import { listMemberEvents } from '../api/events';

import '../styles/MemberDashboard.css';

const MemberDashboard = () => {
  const [eventCode, setEventCode] = useState('');
  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    // TODO: Replace with member id from cookie
    const memberEvents = await listMemberEvents('member_id');
    setEvents(memberEvents);
    console.log('Loaded list of events for user');
  };

  const handleJoinEvent = () => {

  };

  // Load events at page mount
  useEffect(loadEvents, []);

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
        {
          events.map(
            (eventID) => (<EventCard clickAction={() => {}} key={eventID} eventID={eventID} />),
          )
        }
      </div>
    </div>
  );
};

export default MemberDashboard;
