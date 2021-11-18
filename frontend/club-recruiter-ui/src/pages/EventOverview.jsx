import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import Header from '../components/Header';
import UserList from '../components/UserList';
import EventCard from '../components/EventCard';
import CandidateList from '../components/CandidateList';

import { listEventMembers, listEventOrganizers } from '../api/events';

const drawerWidth = 300;

const EventOverview = () => {
  const { eventCode } = useParams();

  const [members, setMembers] = useState([]);
  const [organizers, setOrganizers] = useState([]);

  const loadMembers = async () => {
    // TODO: Replace event_id, add member_id
    const eventMembers = await listEventMembers('event_id');
    setMembers(eventMembers);
    console.log('Loaded list of members for event');
  };

  const loadOrganizers = async () => {
    // TODO: Replace event_id, add member_id
    const eventOrganizers = await listEventOrganizers('event_id');
    setOrganizers(eventOrganizers);
    console.log('Loaded list of organizers for event');
  };

  // Load events at page mount
  useEffect(loadMembers, []);
  useEffect(loadOrganizers, []);

  return (
    <Container sx={{ display: 'flex' }}>
      <Header pageName={`Event Management: ${eventCode}`} />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <UserList nameList={organizers} title="Organizers" />

          <Divider />
          <UserList nameList={members} title="Members" />

        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <EventCard eventID={eventCode} />
        <CandidateList />
      </Box>
    </Container>
  );
};

export default EventOverview;
