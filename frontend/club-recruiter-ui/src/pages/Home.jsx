import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { validateCandidateCode } from '../api/candidate';
import '../styles/Home.css';

const Home = () => {
  const history = useHistory();
  const [candidateCode, setCandidateCode] = useState('');

  const handleApplySubmit = async () => {
    // TODO: Verify candidate code with backend
    if (await validateCandidateCode(candidateCode)) {
      console.log('Candidate code verified!');
      history.push('/dashboard');
    } else {
      console.log('Candidate code invalid!');
      setCandidateCode('');
    }
  };

  return (
    <div className="home">
      <div className="column">
        <h3>Enter Candidate Code to access Club Application</h3>
        <div className="candidate-textbox">
          <TextField fullWidth id="outlined-basic" value={candidateCode} label="Candidate Code" variant="outlined" onChange={(e) => setCandidateCode(e.target.value)} />
        </div>
        <div className="button">
          <Button variant="contained" onClick={handleApplySubmit}>Apply to Club</Button>
        </div>
      </div>
      <div className="column">
        <div className="button">
          <Button
            variant="contained"
            onClick={() => {
              // Use history hook instead of Link to avoid button styling issues
              history.push('/login');
            }}
          >
            Log in to Event Management Portal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
