import { Container, Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import FormFileField from '../components/FormFileField';
import FormTextField from '../components/FormTextField';
import Header from '../components/Header';

const CreateEvent = () => {
  const { control, handleSubmit } = useForm();
  const onSubmit = (data) => {
    // todo: call the API endpoint
    console.log(data);
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
            <FormFileField name="photo" label="Cover Photo (optional)" control={control} accept="image/*" />
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
