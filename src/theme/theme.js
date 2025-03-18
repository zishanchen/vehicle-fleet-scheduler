import { createTheme } from '@mui/material/styles';

// Light mode palette
const lightPalette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#dc004e',
    light: '#ff4081',
    dark: '#9a0036',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
  },
};

// Dark mode palette
const darkPalette = {
  primary: {
    main: '#90caf9',
    light: '#b3e5fc',
    dark: '#6a89cc',
  },
  secondary: {
    main: '#f48fb1',
    light: '#f8bbd0',
    dark: '#c15b7c',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
};

// Create theme function with mode support
const createAppTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    ...(mode === 'light' ? lightPalette : darkPalette),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? lightPalette.primary.main : darkPalette.background.paper,
          color: mode === 'light' ? '#fff' : '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 12px',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiDatePicker: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#fff' : '#2c2c2c',
        },
      },
    },
  },
  // Custom shadows for light and dark modes
  shadows: mode === 'light'
    ? [...createTheme().shadows]  // Default MUI light mode shadows
    : createTheme({ palette: { mode: 'dark' } }).shadows.map((shadow, index) =>
        index === 1 ? 'rgba(255,255,255,0.1) 0px 2px 1px -1px, rgba(255,255,255,0.07) 0px 1px 1px 0px, rgba(255,255,255,0.06) 0px 1px 3px 0px' : shadow
      ),
});

export default createAppTheme;
