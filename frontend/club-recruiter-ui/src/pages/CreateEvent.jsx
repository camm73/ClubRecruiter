import { Container, Button } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import FormFileField from '../components/FormFileField';
import FormTextField from '../components/FormTextField';
import Header from '../components/Header';

import { uploadFile } from '../api/firebase';
import { createEvent } from '../api/events';

const CreateEvent = () => {
  const { control, handleSubmit } = useForm();
  const [eventPicFile, setEventPicFile] = useState(null);
  const history = useHistory();

  const onSubmit = async (data) => {
    console.log(data);
    const fileName = await uploadFile(eventPicFile, 'eventCoverPhoto');
    // Call the event creation API endpoint
    const candidateCode = await createEvent(data.name, data.description, fileName);

    if (candidateCode.length) {
      history.push(`/event/${candidateCode}`);
    } else {
      // eslint-disable-next-line no-alert
      alert('An error occurred creating event!');
    }
  };

  return (
    <div>
      <Container sx={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
        <Header pageName="Create New Event" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Container sx={{
            display: 'flex', flexDirection: 'column', padding: 10, alignItems: 'center',
          }}
          >
            <FormTextField name="name" label="Name" control={control} required />
            <FormTextField name="description" label="Description" control={control} required multiline />
            <FormFileField name="photo" label="Cover Photo (optional)" control={control} accept="image/*" setFile={setEventPicFile} />
            <Button
              variant="contained"
              type="submit"
            >
              Create
            </Button>
          </Container>
        </form>

      </Container>
    </div>
  );
};

export default CreateEvent;
