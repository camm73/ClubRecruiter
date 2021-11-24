import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

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

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
  };

  const loadCandidates = async () => {
    const idList = await getEventCandidates(eventID);
    setCandidateIDList(idList);
  };

  useEffect(loadCandidates, []);

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
          <CandidateEmailList candidateIDList={candidateIDList} title="Email Candidates" filter={filter} refreshEmailList={setFilteredEmailList}>
            <FilterMenu filter={filter} handleChange={handleFilterChange} />
          </CandidateEmailList>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <EventCard eventID={eventID} />
        <EmailForm filteredEmailList={filteredEmailList} />
      </Box>
    </Container>
  );
};

export default EmailPage;
