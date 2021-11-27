import { Container, Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useHistory } from 'react-router-dom';
import FormTextField from './FormTextField';

import { sendEmail } from '../api/emails';

const EmailForm = ({ filteredEmailList }) => {
  const { control, handleSubmit } = useForm();
  const { eventID } = useParams();
  const history = useHistory();

  const onSubmit = async (data) => {
    const emailStatus = await sendEmail(data.title, data.content, eventID, filteredEmailList);
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
          <Button
            variant="contained"
            type="submit"
          >
            Send
          </Button>
        </Container>
      </form>

    </Container>
  );
};

export default EmailForm;
