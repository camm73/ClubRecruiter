import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Header from '../components/Header';
import UserList from '../components/UserList';
import EventCard from '../components/EventCard';
import CandidateList from '../components/CandidateList';
import CandidateProfile from '../components/CandidateProfile';

import { listEventMembers, listEventOrganizers, getEventDetails } from '../api/events';

const drawerWidth = 300;

const EventOverview = () => {
  const { eventID } = useParams();

  const [members, setMembers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [profileVisible, setProfileVisible] = useState(false);
  const [profileCandidateID, setProfileCandidateID] = useState('');
  const [candidateCode, setCandidateCode] = useState('');

  const location = useLocation();
  const history = useHistory();

  const loadMembers = async () => {
    const eventMembers = await listEventMembers(candidateCode);
    setMembers(eventMembers);
    console.log('Loaded list of members for event');
  };

  const loadOrganizers = async () => {
    const eventOrganizers = await listEventOrganizers(candidateCode);
    setOrganizers(eventOrganizers);
    console.log('Loaded list of organizers for event');
  };

  const handleOpenCandidateProfile = (candidateID) => {
    setProfileCandidateID(candidateID);
    setProfileVisible(true);
  };

  const loadEventDetails = async () => {
    const eventDetails = await getEventDetails(eventID);
    setCandidateCode(eventDetails.candidate_code);
    loadMembers();
    loadOrganizers();
  };

  // Load events at page mount
  useEffect(loadEventDetails, []);

  return (
    <Container sx={{ display: 'flex' }}>
      <Header pageName={`Event Management: ${candidateCode}`} />
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
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            style={{ backgroundColor: 'lightgray', borderRadius: '5px', padding: '10px' }}
            onClick={() => {
              const pathName = location.pathname;
              if (pathName.charAt(pathName.length - 1) === '/') {
                history.push(`${pathName}email`);
              } else {
                history.push(`${pathName}/email`);
              }
            }}
          >
            Send Email Update
          </Button>
        </div>
        <EventCard eventID={eventID} />
        <CandidateList profileOpenHandler={handleOpenCandidateProfile} />
      </Box>
      <CandidateProfile
        open={profileVisible}
        candidateID={profileCandidateID}
        closeHandler={() => setProfileVisible(false)}
      />
    </Container>
  );
};

export default EventOverview;
