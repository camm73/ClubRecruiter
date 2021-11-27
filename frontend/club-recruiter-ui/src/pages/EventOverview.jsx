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

import { getEventDetails, isAdmin } from '../api/events';

const drawerWidth = 300;

const EventOverview = () => {
  const { eventID } = useParams();

  const [members, setMembers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [candidateIDList, setCandidateIDList] = useState([]);
  const [profileVisible, setProfileVisible] = useState(false);
  const [profileCandidateID, setProfileCandidateID] = useState('');
  const [eventDetails, setEventDetails] = useState(undefined);
  const [admin, setAdmin] = useState(false);

  const location = useLocation();
  const history = useHistory();

  const handleOpenCandidateProfile = (candidateID) => {
    setProfileCandidateID(candidateID);
    setProfileVisible(true);
  };

  const loadEventDetails = async () => {
    const details = await getEventDetails(eventID);
    setEventDetails(details);
    setMembers(details.members);
    setOrganizers(details.admins);
    setCandidateIDList(details.candidates);
  };

  const checkAdmin = async () => {
    const adminStatus = await isAdmin(eventID);
    setAdmin(adminStatus);
  };

  // Load events at page mount
  useEffect(loadEventDetails, []);
  useEffect(checkAdmin, []);

  return (
    <Container sx={{ display: 'flex' }}>
      <Header pageName="Event Management" authRoute />
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
          <UserList memberIDList={organizers} title="Organizers" promotable={false} refreshFunction={loadEventDetails} />

          <Divider />
          <UserList memberIDList={members} title="Members" promotable refreshFunction={loadEventDetails} />

        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            style={{ backgroundColor: 'lightgray', borderRadius: '5px', padding: '10px' }}
            onClick={() => {
              history.push('/dashboard');
            }}
          >
            Back to Dashboard
          </Button>
          {admin ? (
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
          ) : <div />}
        </div>
        <EventCard
          admin={admin}
          eventID={eventID}
          eventDetails={eventDetails}
          refreshAction={() => {
            history.push('/dashboard');
          }}
        />
        <CandidateList
          candidateIDList={candidateIDList}
          profileOpenHandler={handleOpenCandidateProfile}
        />
      </Box>
      <CandidateProfile
        admin={admin}
        open={profileVisible}
        candidateID={profileCandidateID}
        closeHandler={() => setProfileVisible(false)}
        eventRefresh={loadEventDetails}
      />
    </Container>
  );
};

export default EventOverview;
