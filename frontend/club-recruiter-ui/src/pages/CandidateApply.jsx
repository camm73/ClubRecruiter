import { Container, Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useHistory } from 'react-router-dom';
import FormFileField from '../components/FormFileField';
import FormTextField from '../components/FormTextField';
import Header from '../components/Header';

import { uploadFile } from '../api/firebase';
import { submitCandidateApplication } from '../api/candidate';

const CandidateApply = () => {
  const { control, handleSubmit } = useForm();
  const { candidateCode } = useParams();
  const [resumeFile, setResumeFile] = useState(null);
  const [submittedApp, setSubmittedApp] = useState(false);
  const history = useHistory();

  const onSubmit = async (data) => {
    setSubmittedApp(true);
    const fileName = await uploadFile(resumeFile, 'resume');
    console.log(data);
    console.log(fileName);
    console.log(candidateCode);
    const statusMessage = await submitCandidateApplication(
      candidateCode, data.email, data.name, data.phone, data.additional, fileName,
    );
    setSubmittedApp(false);
    alert(statusMessage);
    history.push('/');
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
      <Header pageName="Club Application Page" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container sx={{
          display: 'flex', flexDirection: 'column', padding: 5, alignItems: 'center',
        }}
        >
          <FormTextField name="name" label="Name" control={control} required />
          <FormTextField name="email" label="Email address" control={control} required />
          <FormTextField name="phone" label="Phone number" control={control} required />
          <FormTextField name="additional" label="Tell us more about yourself :)" control={control} required />
          <FormFileField name="resume" label="Resume/CV (optional)" control={control} accept=".doc,.docx,.pdf" setFile={setResumeFile} />
          <FormTextField name="misc" label="Anything else you would like to share :)" control={control} />
          {!submittedApp ? (
            <Button
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          ) : <CircularProgress />}

        </Container>
      </form>

    </Container>
  );
};

export default CandidateApply;
