import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const columns = [
  {
    field: 'fullName',
    headerName: 'Candidate',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 500,
    valueGetter: (params) => `${params.getValue(params.id, 'firstName') || ''} ${
      params.getValue(params.id, 'lastName') || ''
    }`,
  },
  { field: 'status', headerName: 'Status', width: 130 },
];

// TODO: replace values
const sampleCandidates = [
  {
    id: 1, lastName: 'Snow', firstName: 'Jon', status: 'Accepted',
  },
  {
    id: 2, lastName: 'Lannister', firstName: 'Cersei', status: 'Pending',
  },
  {
    id: 3, lastName: 'Lannister', firstName: 'Jaime', status: 'Pending',
  },
  {
    id: 4, lastName: 'Stark', firstName: 'Arya', status: 'Accepted',
  },
  {
    id: 5, lastName: 'Targaryen', firstName: 'Daenerys', status: 'Rejected',
  },
  {
    id: 6, lastName: 'Melisandre', firstName: null, status: 'Accepted',
  },
  {
    id: 7, lastName: 'Clifford', firstName: 'Ferrara', status: 'Rejected',
  },
];

const CandidateList = ({ profileOpenHandler }) => (
  <Container sx={{ height: 400, width: '100%' }}>
    <Typography sx={{ mt: 4, mb: 2, margin: 2 }} align="center" variant="h6" component="div">
      Candidate List
    </Typography>
    <DataGrid
      rows={sampleCandidates}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      onCellClick={() => {
        profileOpenHandler('candidateID');
      }}
    />
  </Container>
);

export default CandidateList;
