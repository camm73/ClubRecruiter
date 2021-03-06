/* eslint-disable no-await-in-loop */
import {
  TextField, Button, FormControlLabel, Switch,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

import { listMemberEvents, joinEvent, isAdmin } from '../api/events';

import '../styles/MemberDashboard.css';

const MemberDashboard = () => {
  const [memberCode, setMemberCode] = useState('');
  const [events, setEvents] = useState([]);
  const [filterChecked, setFilterChecked] = useState(false);
  const [organizingEvents, setOrganizingEvents] = useState([]);
  const history = useHistory();

  const loadEvents = async () => {
    const memberEvents = await listMemberEvents();
    const orgEvents = [];
    if (memberEvents === undefined) return;
    setEvents(memberEvents);
    // eslint-disable-next-line no-restricted-syntax
    for (const eventID of memberEvents) {
      const adminStatus = await isAdmin(eventID);
      if (adminStatus) {
        orgEvents.push(eventID);
      }
    }
    setOrganizingEvents(orgEvents);
  };

  const handleJoinEvent = async () => {
    const joinRes = await joinEvent(memberCode);
    if (!joinRes.length) {
      alert('Member code is invalid!');
      return;
    }
    // Returns candidate code
    history.push(`/event/${joinRes}`);
  };

  const handleCreateEvent = () => {
    history.push('/createEvent');
  };

  // Load events at page mount
  useEffect(loadEvents, []);

  return (
    <>
      <div className="create-event-button">
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateEvent}>Create New Event</Button>
      </div>
      <div className="dashboard">
        <Header pageName="Member Dashboard" authRoute />
        <div className="join-event">
          <div className="event-code-wrapper">
            <TextField className="event-code-field" fullWidth id="outlined-basic" value={memberCode} label="Member Code" variant="outlined" onChange={(e) => setMemberCode(e.target.value)} />
          </div>
          <Button variant="contained" startIcon={<AddIcon />} disabled={memberCode.length === 0} onClick={handleJoinEvent}>Join Event</Button>
        </div>
        <FormControlLabel
          control={(
            <Switch
              checked={filterChecked}
              onChange={(e) => {
                setFilterChecked(e.target.checked);
              }}
              size="large"
            />
          )}
          label="Only show events I am organizing"
        />
        <div className="event-list">
          { filterChecked
            ? organizingEvents.map(
              (eventID) => (
                <EventCard
                  clickAction={() => {
                    history.push(`/event/${eventID}`);
                  }}
                  key={eventID}
                  eventID={eventID}
                  refreshAction={loadEvents}
                  hideDescription
                />
              ),
            )
            : events.map(
              (eventID) => (
                <EventCard
                  clickAction={() => {
                    history.push(`/event/${eventID}`);
                  }}
                  key={eventID}
                  eventID={eventID}
                  refreshAction={loadEvents}
                  hideDescription
                />
              ),
            )}
        </div>
      </div>
    </>
  );
};

export default MemberDashboard;
