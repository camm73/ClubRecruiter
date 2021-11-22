import {
  DialogTitle, Dialog, DialogContent, Typography, DialogActions, Button,
} from '@mui/material';
import React from 'react';

const ConfirmationDialog = ({
  title, bodyText, open, closeHandler, yesAction,
}) => (
  <Dialog fullWidth sx={{ textAlign: 'center' }} maxWidth="sm" open={open} onBackdropClick={closeHandler}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography variant="body1">
        {bodyText}
      </Typography>
    </DialogContent>
    <DialogActions style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
      <Button style={{ backgroundColor: 'lightgray', padding: '10px', borderRadius: '5px' }} onClick={closeHandler}>No</Button>
      <Button
        style={{ backgroundColor: 'lightgray', padding: '10px', borderRadius: '5px' }}
        onClick={yesAction}
      >
        Yes
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;
