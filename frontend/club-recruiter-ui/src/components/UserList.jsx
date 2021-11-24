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

// import { getMember } from '../api/members';

const UserEntry = ({
  memberID, canDelete, promotable,
}) => {
  const [userName, setUserName] = useState('name');

  const getUserData = async () => {
    if (memberID === undefined || !memberID.length) return;
    // const memberObj = await getMember(memberID);
    // setUserName(memberObj.displayName);
    setUserName('name');
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
      {promotable && (
        <IconButton edge="end" aria-label="delete">
          <ArrowUpwardIcon />
        </IconButton>
      )}
      {!promotable && (
        <IconButton edge="end" aria-label="delete">
          <ArrowDownwardIcon />
        </IconButton>
      )}
      {canDelete && (
        <IconButton edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      )}
    </ListItem>
  );
};

function generate(memberIDList, canDelete = true, promotable = true) {
  if (memberIDList === undefined || !memberIDList.length) return <div />;
  return memberIDList.map(
    (memberID) => (
      <UserEntry
        memberID={memberID}
        key={memberID}
        canDelete={canDelete}
        promotable={promotable}
      />
    ),
  );
}

const UserList = ({
  memberIDList, title, canDelete, children, promotable,
}) => (
  <Grid item>
    <Typography sx={{ mt: 4, mb: 2 }} align="center" variant="h6" component="div">
      {title}
    </Typography>
    {children}
    <List>
      {generate(memberIDList, canDelete, promotable)}
    </List>
  </Grid>
);

export default UserList;
