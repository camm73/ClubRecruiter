import { React, useState } from 'react';
import { useParams } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import Header from '../components/Header';
import UserList from '../components/UserList';
import EventCard from '../components/EventCard';
import EmailForm from '../components/EmailForm';
import FilterMenu from '../components/FilterMenu';

const drawerWidth = 300;

// these are test examples, to be replaced with
// actual candidates sent from the backend when integration is done
const sampleCandidates = [
  {
    name: 'ONE',
    status: 'pending',
  },
  {
    name: 'TWO',
    status: 'accepted',
  },
  {
    name: 'THREE',
    status: 'pending',
  },
  {
    name: 'FOUR',
    status: 'rejected',
  },
];

const getNames = (candidates) => Array.from(candidates, (candidate) => candidate.name);

const EmailPage = () => {
  const [filter, setFilter] = useState('');
  const { eventID } = useParams();
  const [displayNames, setDisplayNames] = useState(getNames(sampleCandidates));

  const handleChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    setDisplayNames(getNames(sampleCandidates.filter((c) => (newFilter !== '' ? c.status === newFilter : c))));
  };

  return (
    <Container sx={{ display: 'flex' }}>
      <Header pageName="Email Page" />
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
          <UserList nameList={displayNames} title="Email Candidates" canDelete={false}>
            <FilterMenu filter={filter} handleChange={handleChange} />
          </UserList>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <EventCard eventID={eventID} />
        <EmailForm />
      </Box>
    </Container>
  );
};

export default EmailPage;
