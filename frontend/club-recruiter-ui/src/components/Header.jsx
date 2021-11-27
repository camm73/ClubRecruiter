import { React } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { logout } from '../api/firebase';

const Header = ({ pageName, authRoute }) => (
  <div position="sticky">
    <AppBar
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ color: 'black', fontWeight: 'bold' }}>
          RecruitMe
        </Typography>

        <Typography variant="h6" component="div" sx={{ color: 'black' }}>
          {pageName}
        </Typography>
        {authRoute ? (
          <Button
            style={{
              backgroundColor: 'lightgray',
              color: 'black',
              paddingTop: '5px',
              paddingBottom: '5px',
              paddingLeft: '10px',
              paddingRight: '10px',
              borderRadius: '3px',
            }}
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        ) : <div />}
      </Toolbar>
    </AppBar>
  </div>
);

export default Header;
