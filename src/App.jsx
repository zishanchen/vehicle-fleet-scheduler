import React, { useState, useMemo } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  Container, 
  IconButton 
} from '@mui/material';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import GanttChart from './components/GanttChart';
import FilterPanel from './components/FilterPanel';
import BookingDetails from './components/BookingDetails';
import VehicleUtilizationHeatmap from './components/VehicleUtilizationHeatmap';
import DashboardStatistics from './components/DashboardStatistics';

function App() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [mode, setMode] = useState('light');
  
  // Create theme based on current mode
  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'light' ? '#1976d2' : '#90caf9',
        },
        background: {
          default: mode === 'light' ? '#f5f5f5' : '#121212',
        },
      },
    }),
    [mode]
  );
  
  const toggleColorMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };
  
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setOpenDetailsModal(true);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <AppProvider>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh' 
          }}>
            <Header />
            <FilterPanel />
            
            {/* Mode toggle button */}
            <IconButton 
              onClick={toggleColorMode} 
              color="inherit"
              sx={{ 
                position: 'fixed', 
                bottom: 16, 
                right: 16, 
                zIndex: 1000,
                bgcolor: mode === 'light' ? 'primary.main' : 'background.paper',
                color: mode === 'light' ? 'white' : 'primary.main',
                '&:hover': {
                  bgcolor: mode === 'light' ? 'primary.dark' : 'background.default'
                }
              }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            
            <Box component="main" sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              overflow: 'hidden' 
            }}>
              <Container maxWidth={false} sx={{ 
                height: '100%', 
                display: 'flex', 
                gap: 2 
              }}>
                <Box sx={{ flexGrow: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <GanttChart onBookingClick={handleBookingClick} />
                  <DashboardStatistics />
                </Box>
                <Box sx={{ width: 300, height: '100%' }}>
                  <VehicleUtilizationHeatmap />
                </Box>
              </Container>
            </Box>
            
            <BookingDetails 
              booking={selectedBooking}
              open={openDetailsModal}
              onClose={() => setOpenDetailsModal(false)}
            />
          </Box>
        </AppProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
