import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fdc54a',
    },
    secondary: {
      main: '#234f72',
    },
    third: {
      main: '#171d23',
    },
    fourth: {
      main: '#556cd6',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  breakpoints: {
    values: {
      xxs: 0,
      xs: 460,
      sm: 600,
      smd: 750,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
