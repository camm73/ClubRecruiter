import React from 'react';
import { useParams } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import Header from '../components/Header';
import UserList from '../components/UserList';

const EventOverview = () => {
  const { eventCode } = useParams();
  return (
    <div>
      <Header pageName={`Event Management: ${eventCode}`} />
      <h1>HOME PAGE</h1>

      <Drawer
        variant="permanent"
        sx={{
          width: '20%',
        }}
      >
        <UserList nameList={['Tian Yu Liu', 'Wen Hong Lam']} title="Organizers" />
        <UserList nameList={['Zachary', 'Jackson', 'Rex']} title="Members" />
      </Drawer>
    </div>
  );
};

export default EventOverview;
