import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  ToggleButtonGroup, 
  ToggleButton,
  useTheme
} from '@mui/material';
import { 
  Today as TodayIcon, 
  ViewDay as ViewDayIcon, 
  ViewWeek as ViewWeekIcon, 
  ViewModule as ViewModuleIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { DatePicker } from '@mui/x-date-pickers';

const Header = () => {
  const theme = useTheme();
  const { 
    viewMode, 
    setViewMode, 
    currentDate, 
    setCurrentDate,
    zoomLevel,
    setZoomLevel
  } = useAppContext();
  
  const handleViewModeChange = (_, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  return (
    <AppBar 
      position="static" 
      color="primary" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      }}
    >
      <Toolbar>
        <TodayIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Vehicle Fleet Scheduler
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Date picker */}
          <DatePicker 
            value={currentDate}
            onChange={setCurrentDate}
            slotProps={{
              textField: {
                size: 'small',
                sx: { 
                  bgcolor: theme.palette.background.paper,
                  width: 170,
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.23)' 
                        : 'rgba(0,0,0,0.23)',
                    },
                  }
                }
              }
            }}
          />
          
          {/* View mode toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            sx={{ 
              bgcolor: theme.palette.background.paper, 
              borderRadius: 1,
              '& .MuiToggleButton-root': {
                color: theme.palette.text.primary,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }
              }
            }}
          >
            <ToggleButton value="day" aria-label="day view">
              <ViewDayIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="week" aria-label="week view">
              <ViewWeekIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="month" aria-label="month view">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          
          {/* Zoom controls */}
          <Box>
            <IconButton 
              color="inherit" 
              onClick={handleZoomOut}
              sx={{ 
                bgcolor: theme.palette.background.paper, 
                mr: 1,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
              size="small"
            >
              <ZoomOutIcon fontSize="small" />
            </IconButton>
            <IconButton 
              color="inherit" 
              onClick={handleZoomIn}
              sx={{ 
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
              size="small"
            >
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
