import { Container, Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import FormTextField from './FormTextField';

const EmailForm = () => {
  // const [name, setName] = useState('');
  const { control, handleSubmit } = useForm();
  const onSubmit = (data) => {
    // todo: call the API endpoint
    console.log(data);
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
