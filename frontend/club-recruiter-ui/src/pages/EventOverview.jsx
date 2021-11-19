import React, { useState } from 'react';
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
import CandidateProfile from '../components/CandidateProfile';

const drawerWidth = 300;

const EventOverview = () => {
  const { eventCode } = useParams();
  const [profileVisible, setProfileVisible] = useState(false);
  const [profileCandidateID, setProfileCandidateID] = useState('');

  const handleOpenCandidateProfile = (candidateID) => {
    setProfileCandidateID(candidateID);
    setProfileVisible(true);
  };

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
          <UserList nameList={['Tian Yu Liu', 'Wen Hong Lam']} title="Organizers" />

          <Divider />
          <UserList nameList={['Zachary', 'Jackson', 'Rex']} title="Members" />

        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <EventCard />
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
