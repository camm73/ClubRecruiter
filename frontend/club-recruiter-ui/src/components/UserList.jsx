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

const UserEntry = ({ name, canDelete }) => (
  <ListItem
    secondaryAction={canDelete && (
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

function generate(list, canDelete = true) {
  return list.map((name) => (<UserEntry name={name} canDelete={canDelete} />));
}

const UserList = ({
  nameList, title, canDelete, children,
}) => (
  <Grid item>
    <Typography sx={{ mt: 4, mb: 2 }} align="center" variant="h6" component="div">
      {title}
    </Typography>
    {children}
    <List>
      {generate(nameList, canDelete)}
    </List>
  </Grid>
);

export default UserList;
