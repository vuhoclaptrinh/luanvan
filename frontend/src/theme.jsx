import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // màu xanh dương chính
    },
    secondary: {
      main: '#dc004e', // màu phụ
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;