import { React } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = ({ pageName }) => (
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
      </Toolbar>
    </AppBar>
  </div>
);

export default Header;
