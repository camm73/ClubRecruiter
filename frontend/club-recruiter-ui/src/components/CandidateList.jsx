import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { getEventCandidates, getCandidate } from '../api/candidate';

const columns = [
  {
    field: 'name',
    headerName: 'Candidate',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 500,
  },
  { field: 'status', headerName: 'Status', width: 130 },
];

// TODO: replace values
/*
const sampleCandidates = [
  {
    id: 1, name: 'Jon Snow', status: 'Accepted',
  },
  {
    id: 2, name: 'Cersei Lannister', status: 'Pending',
  },
  {
    id: 3, name: 'Jaime Lannister', status: 'Pending',
  },
  {
    id: 4, name: 'Arya Stark', status: 'Accepted',
  },
  {
    id: 5, name: 'Daenerys Targaryen', status: 'Rejected',
  },
  {
    id: 6, name: 'Melisandre', status: 'Accepted',
  },
  {
    id: 7, name: 'Ferrara Clifford', status: 'Rejected',
  },
];
*/

const CandidateList = ({ eventID, profileOpenHandler }) => {
  const [candidates, setCandidates] = useState([]);
  // const [candidateIDList, setCandidateIDList] = useState([]);
  const [candidateRows, setCandidateRows] = useState([]);

  const loadCandidates = async () => {
    const idList = await getEventCandidates(eventID);

    const eventCandidates = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const id of idList) {
      // eslint-disable-next-line no-await-in-loop
      const candRes = await getCandidate(id);
      candRes.candidateID = id;
      eventCandidates.push(candRes);
    }
    setCandidates(eventCandidates);

    const rowList = [];
    eventCandidates.forEach((candidateEntry, index) => {
      const candRow = {
        id: index,
        name: candidateEntry.name,
        status: candidateEntry.applicationStatus,
        candidate_id: candidateEntry.candidateID,
      };
      rowList.push(candRow);
    });
    setCandidateRows(rowList);
    console.log(candidates);
  };

  useEffect(loadCandidates, []);

  return (
    <Container sx={{ height: 400, width: '100%' }}>
      <Typography sx={{ mt: 4, mb: 2, margin: 2 }} align="center" variant="h6" component="div">
        Candidate List
      </Typography>
      <DataGrid
        rows={candidateRows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onCellClick={(params) => {
          console.log(params);
          profileOpenHandler('candidateID');
        }}
      />
    </Container>
  );
};

export default CandidateList;
