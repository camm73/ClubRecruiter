import { React, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Header from '../components/Header';
import EventCard from '../components/EventCard';
import EmailForm from '../components/EmailForm';
import FilterMenu from '../components/FilterMenu';
import CandidateEmailList from '../components/CandidateEmailList';

import { getEventCandidates } from '../api/candidate';

const drawerWidth = 300;

const EmailPage = () => {
  const [filter, setFilter] = useState('');
  const [candidateIDList, setCandidateIDList] = useState([]);
  const [filteredEmailList, setFilteredEmailList] = useState([]);
  const { eventID } = useParams();
  const history = useHistory();

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    if (newFilter === undefined) return;
    setFilter(newFilter);
  };

  const loadCandidates = async () => {
    const idList = await getEventCandidates(eventID);
    setCandidateIDList(idList);
  };

  useEffect(loadCandidates, []);

  return (
    <Container sx={{ display: 'flex' }}>
      <Header pageName="Email Page" authRoute />
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
          <CandidateEmailList candidateIDList={candidateIDList} title="Email Candidates" filter={filter} refreshEmailList={setFilteredEmailList}>
            <FilterMenu filter={filter} handleChange={handleFilterChange} />
          </CandidateEmailList>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Button
          style={{
            backgroundColor: 'lightgray', color: 'black', borderRadius: '5px', padding: '10px',
          }}
          onClick={() => {
            history.push(`/event/${eventID}`);
          }}
        >
          Back to Event Overview
        </Button>
        <EventCard eventID={eventID} />
        <EmailForm filteredEmailList={filteredEmailList} />
      </Box>
    </Container>
  );
};

export default EmailPage;
