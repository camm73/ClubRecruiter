import { Container, Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import FormFileField from '../components/FormFileField';
import FormTextField from '../components/FormTextField';
import Header from '../components/Header';

const CandidateApply = () => {
  // const [name, setName] = useState('');
  const { control, handleSubmit } = useForm();
  const onSubmit = (data) => {
    // todo: call the API endpoint
    console.log(data);
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
      <Header pageName="Club Sign Up Page" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container sx={{
          display: 'flex', flexDirection: 'column', padding: 5, alignItems: 'center',
        }}
        >
          <FormTextField name="code" label="Event code" control={control} required />
          <FormTextField name="name" label="Name" control={control} required />
          <FormTextField name="email" label="Email address" control={control} required />
          <FormTextField name="phone" label="Phone number" control={control} required />
          <FormTextField name="additional" label="Tell us more about yourself :)" control={control} required />
          <FormFileField name="resume" label="Resume/CV (optional)" control={control} accept=".doc,.docx,.pdf" />
          <FormTextField name="misc" label="Anything else you would like to share :)" control={control} />
          <Button
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
        </Container>
      </form>

    </Container>
  );
};

export default CandidateApply;
