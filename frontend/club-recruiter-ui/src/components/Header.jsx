import { React } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = ({ pageName }) => (
  <>
    <AppBar
      position="sticky"
      sx={{ bgcolor: '#FCDDEC', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ color: 'black', fontWeight: 'bold' }}>
          RecruitMe
        </Typography>

        <Typography variant="h6" component="div" sx={{ color: 'black', margin: 'auto' }}>
          {pageName}
        </Typography>
      </Toolbar>
    </AppBar>
  </>
);

export default Header;
