/* eslint-disable react/no-array-index-key */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
import { React, useState, useEffect } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';

import { getCandidate } from '../api/candidate';

const CandidateEntry = ({
  candidateName,
}) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar>
        <PersonIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={candidateName}
    />
  </ListItem>
);

const CandidateEmailList = ({
  candidateIDList, title, children, filter, refreshEmailList,
}) => {
  const [candidateObjList, setCandidateObjList] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);

  const loadCandidates = async () => {
    const candArr = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const id of candidateIDList) {
      // eslint-disable-next-line no-await-in-loop
      const currCand = await getCandidate(id);
      currCand.candidate_id = id;
      candArr.push(currCand);
    }
    setCandidateObjList(candArr);
  };

  const filterCandidates = () => {
    const tmpArr = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const cand of candidateObjList) {
      console.log(`${cand.application_status}  vs.  ${filter}`);
      if (filter === '' || cand.application_status === filter) {
        tmpArr.push(cand);
      }
    }
    setFilteredCandidates(tmpArr);
    refreshEmailList(tmpArr);
  };

  useEffect(loadCandidates, [candidateIDList]);
  useEffect(filterCandidates, [candidateObjList, filter]);
  return (
    <Grid item>
      <Typography sx={{ mt: 4, mb: 2 }} align="center" variant="h6" component="div">
        {title}
      </Typography>
      {children}
      <List>
        {filteredCandidates.map((candObj, index) => (
          <CandidateEntry key={`${candObj.name}-${index}`} candidateName={candObj.name} />
        ))}
      </List>
    </Grid>
  );
};

export default CandidateEmailList;
