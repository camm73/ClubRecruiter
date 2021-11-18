import React, { useRef, useState } from 'react';
import {
  Box, TextField, ButtonBase, Typography,
} from '@mui/material';
import { Controller } from 'react-hook-form';

const FormFileField = ({
  name, label, control, required, accept,
}) => {
  const ref = useRef();
  const [attachment, setAttachment] = useState(null);

  return (
    <Controller
      name={name}
      control={control}
      default=""
      rules={{ required }}
      render={({ field: { onChange } }) => {
        const handleChange = (event) => {
          const files = Array.from(event.target.files);
          const [file] = files;
          setAttachment(file);
          onChange(event);
        };
        return (
          <Box
            width={0.5}
            mb={5}
          >

            <Typography>
              {label}
            </Typography>
            <ButtonBase
              onClick={() => ref.current?.click()}
              sx={{ width: 1.0 }}
            >
              <TextField
                variant="outlined"
                fullWidth
                disabled
                label={attachment ? attachment.name : '🔗 Choose file'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F9F9F9',
                  },
                }}
              />
              <input
                ref={ref}
                type="file"
                accept={accept}
                hidden
                onChange={handleChange}
              />
            </ButtonBase>
          </Box>
        );
      }}
    />
  );
};

export default FormFileField;
