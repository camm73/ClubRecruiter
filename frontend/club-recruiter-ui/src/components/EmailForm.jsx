/* eslint-disable no-restricted-syntax */
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

  const processBody = (body) => {
    const sentenceArr = body.split('\n');
    const htmlStr = [];

    for (const sentence of sentenceArr) {
      const sanitizedSentence = sentence.replace('<', '').replace('>', '');
      if (sanitizedSentence.length > 0) {
        htmlStr.push(`<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">${sanitizedSentence}</p>`);
      } else {
        htmlStr.push('<br>');
      }
    }

    return htmlStr;
  };

  const onSubmit = async (data) => {
    setEmailSent(true);
    const htmlBody = processBody(data.content);
    const emailStatus = await sendEmail(data.title, htmlBody, eventID, filteredEmailList);
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
