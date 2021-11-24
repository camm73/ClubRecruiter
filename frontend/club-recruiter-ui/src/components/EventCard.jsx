import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import ConfirmationDialog from './ConfirmationDialog';
import { getEventDetails, deleteEvent } from '../api/events';
import { getEventCoverPhotoLink } from '../api/firebase';

const EventCard = ({ clickAction, eventID, refreshAction }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [coverPhotoLink, setCoverPhotoLink] = useState('');
  const [candidateCode, setCandidateCode] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const loadDetails = async () => {
    const details = await getEventDetails(eventID);
    setTitle(details.name);
    setCandidateCode(details.candidate_code);
    setDescription(details.description);
    setMemberCode(details.member_code);
    setCandidates(details.candidates);
    const imageLink = await getEventCoverPhotoLink(details.cover_pic_id);
    setCoverPhotoLink(imageLink);
    console.log('Loaded event details on event card');
  };

  useEffect(loadDetails, []);

  return (
    <div>
      <ConfirmationDialog
        open={confirmationOpen}
        closeHandler={() => setConfirmationOpen(false)}
        yesAction={async () => {
          const deleteRes = await deleteEvent(eventID);
          if (deleteRes) {
            refreshAction();
          } else {
            alert('Failed to delete event');
          }
          setConfirmationOpen(false);
        }}
        title="Confirm Event Deletion"
        bodyText="Are you sure you want to delete this event?"
      />
      <Card sx={{
        display: 'flex', margin: 3, bgcolor: '#E5E5E5',
      }}
      >
        <CardActionArea
          style={{ display: 'flex', flexDirection: 'row' }}
          disabled={clickAction === undefined}
          onClick={clickAction}
        >
          <CardMedia
            component="img"
            style={{
              maxWidth: 250,
            }}
            image={coverPhotoLink}
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
                <h4>
                  Number of Candidates:
                  {' '}
                  {candidates === undefined ? 0 : candidates.length}
                </h4>
              </Box>
            </CardContent>
          </Box>
        </CardActionArea>
        <IconButton onClick={() => {
          setConfirmationOpen(true);
        }}
        >
          <DeleteIcon />
        </IconButton>
      </Card>
    </div>
  );
};

export default EventCard;
