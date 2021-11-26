import { React, useState, useEffect } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useParams } from 'react-router-dom';

import {
  getMember, promoteMember, demoteMember, removeMember,
} from '../api/members';
import { isAdmin } from '../api/events';

const UserEntry = ({
  memberID, canDelete, promotable, refreshFunction,
}) => {
  const [userName, setUserName] = useState('');
  const [admin, setAdmin] = useState(false);
  const { eventID } = useParams();

  const getUserData = async () => {
    if (memberID === undefined || !memberID.length) return;
    const memberObj = await getMember(memberID);
    setUserName(memberObj.displayName);
    console.log(`Event ID: ${eventID}`);
    const adminStatus = await isAdmin(eventID);
    setAdmin(adminStatus);
  };

  useEffect(getUserData, [memberID]);

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={userName}
      />
      {promotable && admin && (
        <IconButton
          edge="end"
          aria-label="promote"
          onClick={async () => {
            const promoteSuccess = await promoteMember(memberID, eventID);
            if (!promoteSuccess) {
              alert('You are not permitted to promte users!');
            } else {
              refreshFunction();
            }
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      )}
      {!promotable && admin && (
        <IconButton
          edge="end"
          aria-label="demote"
          onClick={async () => {
            const demoteSuccess = await demoteMember(memberID, eventID);
            if (!demoteSuccess) {
              alert('You are not permitted to demote members!');
            } else {
              refreshFunction();
            }
          }}
        >
          <ArrowDownwardIcon />
        </IconButton>
      )}
      {canDelete && admin && (
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={async () => {
            const removeSuccess = await removeMember(memberID, eventID);
            if (!removeSuccess) {
              alert('You are not allowed to remove member from event!');
            } else {
              refreshFunction();
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </ListItem>
  );
};

function generate(memberIDList, refreshFunction, canDelete = true, promotable = true) {
  if (memberIDList === undefined || !memberIDList.length) return <div />;
  return memberIDList.map(
    (memberID) => (
      <UserEntry
        memberID={memberID}
        key={memberID}
        canDelete={canDelete}
        promotable={promotable}
        refreshFunction={refreshFunction}
      />
    ),
  );
}

const UserList = ({
  memberIDList, title, canDelete, children, promotable, refreshFunction,
}) => (
  <Grid item>
    <Typography sx={{ mt: 4, mb: 2 }} align="center" variant="h6" component="div">
      {title}
    </Typography>
    {children}
    <List>
      {generate(memberIDList, refreshFunction, canDelete, promotable)}
    </List>
  </Grid>
);

export default UserList;
