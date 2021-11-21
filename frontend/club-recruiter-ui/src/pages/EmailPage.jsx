import { React, useState } from 'react';
import { useParams } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import Header from '../components/Header';
import UserList from '../components/UserList';
import EventCard from '../components/EventCard';
import EmailForm from '../components/EmailForm';

const drawerWidth = 300;

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

const EmailPage = (candidates) => {
  const [filter, setFilter] = useState('');
  const { eventCode } = useParams();
  const [displayNames, setDisplayNames] = useState(getNames(sampleCandidates));
  console.log(eventCode);
  console.log(candidates);

  const handleChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    setDisplayNames(getNames(sampleCandidates.filter((c) => (newFilter !== '' ? c.status === newFilter : c))));
  };

  const FilterMenu = () => {
    const stateMap = {
      pending: {
        color: '#FB9005',
        text: 'Pending',
      },
      accepted: {
        color: '#34A853',
        text: 'Accepted',
      },
      rejected: {
        color: '#EA4335',
        text: 'Rejected',
      },
      '': {
        color: '#000000',
        text: 'None',
      },
    };

    return (
      <Container sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}
      >
        <Typography>Filter</Typography>
        <Select
          onChange={handleChange}
          value={filter}
          sx={{
            backgroundColor: 'FEF8F8',
            width: 0.7,
            color: stateMap[filter].color,
            '&. css-hfutr2-MuiSvgIcon-root-MuiSelect-icon': {
              color: stateMap[filter].color,
            },
          }}
        >
          {Object.entries(stateMap).map(([k, v]) => (
            <MenuItem value={k} key={k} sx={{ color: v.color }}>
              {v.text}
            </MenuItem>
          ))}
        </Select>
      </Container>
    );
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
            <FilterMenu />
          </UserList>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <EventCard />
        <EmailForm />
      </Box>
    </Container>
  );
};

export default EmailPage;
