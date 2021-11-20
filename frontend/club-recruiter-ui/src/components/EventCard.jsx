import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { getEventDetails } from '../api/events';

const EventCard = ({ clickAction, candidateCode }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [imageLink, setImageLink] = useState('');

  const loadDetails = async () => {
    // TODO: Replace with member id from cookie
    const details = await getEventDetails(candidateCode);
    setTitle(details.title);
    setDescription(details.description);
    setMemberCode(details.memberCode);
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
                Candidate Code:
                {' '}
                {candidateCode}
              </h4>
              <h4>
                Member Code:
                {' '}
                {memberCode}
              </h4>
            </Box>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
