import React, { useState } from 'react';
import {
  Button, TextField,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { validateCandidateCode } from '../api/candidate';
import { signInWithGoogle } from '../api/firebase';
import emailImage from '../assets/EmailPortal.png';
import applicationImage from '../assets/CandidateApplication.png';
import profileImage from '../assets/CandidateInfo.png';
import eventImage from '../assets/EventOverview.png';
import Header from '../components/Header';
import '../styles/Home.css';
import ImageCarousel from '../components/ImageCarousel';

const Home = () => {
  const history = useHistory();
  const [candidateCode, setCandidateCode] = useState('');

  const imageList = [eventImage, applicationImage, profileImage, emailImage];
  const captionList = [
    'View event details, club members, candidates, and organizers in the Event Management Portal.',
    'Candidates can apply to a club in a matter of minutes, with no sign-up required.',
    'Club members can view candidate profiles and collaboratively add comments.',
    'Email candidates using generic template emails that are customized to each candidate.',
  ];

  const handleApplySubmit = async () => {
    // TODO: Verify candidate code with backend
    if (await validateCandidateCode(candidateCode)) {
      console.log('Candidate code verified!');
      history.push(`/apply/${candidateCode}`);
    } else {
      console.log('Candidate code invalid!');
      setCandidateCode('');
    }
  };

  return (
    <div>
      <Header pageName="" />
      <div className="intro">
        <div className="column">
          <p className="intro-text">
            RecruitMe is a recruitment pipeline management platform for student organizations.
            RecruitMe empowers event organizers to provide a single hub for club applications,
            event details and updates, candidate profile consolidation, and acceptance status
            tracking.
          </p>
          <h3>Features</h3>
          <ul>
            <li className="feature-item">Collect applications from prospective members</li>
            <li className="feature-item">
              Collaboratively contribute information to candidate profiles
            </li>
            <li className="feature-item">Streamline event communications with an integrated email client</li>
            <li className="feature-item">Manage events for multiple organizations from a single account</li>
          </ul>
        </div>
        <div className="column">
          <ImageCarousel imageList={imageList} captionList={captionList} imageHeight="280" cardSize={500} />
        </div>
      </div>
      <div className="login-apply">
        <div className="column left-column">
          <h2>Candidate Application Portal</h2>
          <p>Interested in joining a student organization? Enter your Candidate Code below.</p>
          <div className="candidate-textbox">
            <TextField fullWidth id="outlined-basic" value={candidateCode} label="Candidate Code" variant="outlined" onChange={(e) => setCandidateCode(e.target.value)} />
          </div>
          <div className="button">
            <Button variant="contained" startIcon={<AssignmentIcon />} disabled={candidateCode.length === 0} onClick={handleApplySubmit}>Apply to Club</Button>
          </div>
        </div>
        <div className="column right-column">
          <h2>Event Management Portal</h2>
          <p>Login to manage your event or join an existing event.</p>
          <div className="button">
            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={async () => {
                // Navigate to Dashboard on successful login
                if (await signInWithGoogle()) {
                  // Use history hook instead of Link to avoid button styling issues
                  history.push('/dashboard');
                }
              }}
            >
              Log in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
