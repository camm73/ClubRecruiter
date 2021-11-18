import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { getEventDetails } from '../api/events';

const EventCard = ({ clickAction, eventID }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [imageLink, setImageLink] = useState('');

  const loadDetails = async () => {
    // TODO: Replace with member id from cookie
    const details = await getEventDetails(eventID);
    setTitle(details.title);
    setDescription(details.description);
    setAccessCode(details.accessCode);
    setImageLink(details.imageLink);
    console.log('Loaded event details on event card');
  };

  useEffect(loadDetails, []);

  return (
    <Card sx={{
      display: 'flex', margin: 3, bgcolor: '#E5E5E5',
      // eslint-disable-next-line indent
  // eslint-disable-next-line indent
  }}
    >
      {console.log(`Loaded card for ${eventID}`)}
      <CardActionArea sx={{ display: 'flex', flexDirection: 'row' }} disabled={clickAction === undefined} onClick={clickAction}>
        <CardMedia
          component="img"
          sx={{ width: 200 }}
          image={imageLink}
          alt="logo"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h4">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              {description}
            </Typography>

            <Box sx={{ fontWeight: 'bold' }}>
              <h4>
                Event Code:
                {' '}
                {eventID}
              </h4>
              <h4>
                Access Code:
                {' '}
                {accessCode}
              </h4>
            </Box>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
