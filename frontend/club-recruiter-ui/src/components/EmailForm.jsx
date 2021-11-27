import { Container, Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useHistory } from 'react-router-dom';
import FormTextField from './FormTextField';

import { sendEmail } from '../api/emails';

const EmailForm = ({ filteredEmailList }) => {
  const [emailSent, setEmailSent] = useState(false);
  const { control, handleSubmit } = useForm();
  const { eventID } = useParams();
  const history = useHistory();

  const onSubmit = async (data) => {
    setEmailSent(true);
    console.log(data);
    const emailStatus = await sendEmail(data.title, data.content, eventID, filteredEmailList);
    setEmailSent(false);
    if (emailStatus) {
      alert('Successfully sent email!');
      history.push(`/event/${eventID}`);
    } else {
      alert('Failed to send email!');
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container sx={{
          display: 'flex', flexDirection: 'column', padding: 5, alignItems: 'flex-end',
        }}
        >
          <FormTextField name="title" label="Email title" control={control} required width={1} />
          <FormTextField name="content" label="Email content" control={control} required multiline width={1} />
          {!emailSent ? (
            <Button
              variant="contained"
              type="submit"
            >
              Send
            </Button>
          ) : <CircularProgress />}
        </Container>
      </form>

    </Container>
  );
};

export default EmailForm;
