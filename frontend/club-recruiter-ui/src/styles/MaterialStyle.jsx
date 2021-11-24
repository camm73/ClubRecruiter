import { createTheme } from '@mui/material/styles';

const recruitMeTheme = createTheme({
  palette: {
    primary: {
      main: '#FCDDEC',
      light: '#FEF8F8',
      contrastText: '#EF5DA8',
    },
  },
});

export {
  // eslint-disable-next-line import/prefer-default-export
  recruitMeTheme,
};
