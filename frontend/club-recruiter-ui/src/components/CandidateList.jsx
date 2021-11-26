/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { getCandidate } from '../api/candidate';

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

const CandidateList = ({ candidateIDList, profileOpenHandler }) => {
  const [candidateRows, setCandidateRows] = useState([]);

  const loadCandidates = async () => {
    const rowArr = [];
    for (const id of candidateIDList) {
      const currCand = await getCandidate(id);
      currCand.candidate_id = id;
      rowArr.push({
        id,
        name: currCand.name,
        status: currCand.application_status,
      });
    }
    setCandidateRows(rowArr);
  };

  useEffect(loadCandidates, [candidateIDList]);

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
          profileOpenHandler(params.row.id);
        }}
      />
    </Container>
  );
};

export default CandidateList;
