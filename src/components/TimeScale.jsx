import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { format, isToday } from 'date-fns';

const TimeScale = ({ dateRange, viewMode, headerLabels, width }) => {
  const theme = useTheme();
  
  // Calculate column width
  const dayWidth = width / (headerLabels.length || 1);
  
  // Today's date for highlighting
  const today = new Date();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      {/* Vehicle info column */}
      <Box 
        sx={{ 
          width: 200, 
          flexShrink: 0, 
          p: 1, 
          borderRight: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Typography variant="subtitle2">Vehicles</Typography>
      </Box>
      
      {/* Time scale headers */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {headerLabels.map((day, index) => (
          <Box 
            key={index}
            sx={{ 
              width: dayWidth,
              flexShrink: 0,
              p: 1,
              textAlign: 'center',
              borderRight: index < headerLabels.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              bgcolor: isToday(day.date) ? 'action.selected' : day.isWeekend ? 'action.hover' : 'inherit'
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                fontWeight: isToday(day.date) ? 'bold' : 'normal'
              }}
            >
              {day.label}
            </Typography>
            
            {viewMode !== 'month' && (
              <Typography 
                variant="caption" 
                color="text.secondary"
              >
                {format(day.date, 'MMM')}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TimeScale;
