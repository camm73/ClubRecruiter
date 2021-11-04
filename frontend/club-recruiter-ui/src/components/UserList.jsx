import { React } from 'react';

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

const UserEntry = ({ name }) => (
  <ListItem
    secondaryAction={(
      <IconButton edge="end" aria-label="delete">
        <DeleteIcon />
      </IconButton>
                )}
  >
    <ListItemAvatar>
      <Avatar>
        <PersonIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={name}
    />
  </ListItem>
);

function generate(list) {
  return list.map((name) => (<UserEntry name={name} />));
}

const UserList = ({ nameList, title }) => (
  <Grid item sx={{ padding: 2 }}>
    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
      {title}
    </Typography>
    <List>
      {generate(nameList)}
    </List>
  </Grid>
);

export default UserList;
