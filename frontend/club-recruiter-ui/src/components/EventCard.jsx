import { React } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const EventCard = () => (
  <Card sx={{ display: 'flex', margin: 3, bgcolor: '#E5E5E5' }}>
    <CardMedia
      component="img"
      sx={{ width: 200 }}
      image="https://www.logolynx.com/images/logolynx/6c/6c7854a6d47c80ca417063d1c36fd4e9.jpeg"
      alt="ZZZ logo"
    />
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography component="div" variant="h4">
          Zeta Zeta Zeta Rush
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          Fall 2021 Zeta Zeta Zeta Rush
        </Typography>

        <Box sx={{ fontWeight: 'bold' }}>
          <h4>
            Event Code: ComeAndZZZ
          </h4>
          <h4>
            Access Code: WeLoveUSC
          </h4>
        </Box>
      </CardContent>
    </Box>
  </Card>
);

export default EventCard;
