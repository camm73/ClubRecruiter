import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import React from 'react';

const FormTextField = ({
  name, label, control, required,
}) => (
  <Controller
    name={name}
    control={control}
    default=""
    rules={{ required }}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <TextField
        label={`${label}${required ? ' *' : ''}`}
        variant="outlined"
        value={value || ''}
        onChange={onChange}
        error={!!error}
        helperText={error ? 'Empty field!' : ' '}
        sx={{
          mb: 2,
          width: 0.5,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F9F9F9',
          },
        }}
      />
    )}
  />
);

export default FormTextField;