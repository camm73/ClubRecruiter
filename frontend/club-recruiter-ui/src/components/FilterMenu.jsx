import React from 'react';

import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const FilterMenu = ({ filter, handleChange }) => {
  const stateMap = {
    pending: {
      color: '#FB9005',
      text: 'Pending',
    },
    accepted: {
      color: '#34A853',
      text: 'Accepted',
    },
    rejected: {
      color: '#EA4335',
      text: 'Rejected',
    },
    '': {
      color: '#000000',
      text: 'None',
    },
  };

  return (
    <Container sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}
    >
      <Typography>Filter</Typography>
      <Select
        onChange={handleChange}
        value={filter}
        sx={{
          width: 0.7,
          color: stateMap[filter].color,
          borderColor: '#FEF8F8',
          outline: 'none',
          '& .MuiSelect-iconOutlined': {
            color: stateMap[filter].color,
          },
          '& .MuiSelect-select': {
            backgroundColor: '#FEF8F8',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        {Object.entries(stateMap).map(([k, v]) => (
          <MenuItem value={k} key={k} sx={{ color: v.color }}>
            {v.text}
          </MenuItem>
        ))}
      </Select>
    </Container>
  );
};

export default FilterMenu;
