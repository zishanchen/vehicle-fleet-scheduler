import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { isToday } from 'date-fns';
import BookingBar from './BookingBar';

const VehicleRow = ({ 
  vehicle, 
  dateRange, 
  bookings, 
  chartWidth, 
  onBookingClick,
  onBookingDrop,
  onBookingResize
}) => {
  // Number of days in the current view
  const daysInView = Math.floor((dateRange.end - dateRange.start) / (24 * 60 * 60 * 1000)) + 1;
  
  // Calculate cell width
  const dayCellWidth = chartWidth / daysInView;
  
  // Generate day cells
  const dayCells = Array.from({ length: daysInView }, (_, index) => {
    const cellDate = new Date(dateRange.start);
    cellDate.setDate(cellDate.getDate() + index);
    
    return {
      date: cellDate,
      isToday: isToday(cellDate),
      isWeekend: [0, 6].includes(cellDate.getDay())
    };
  });
  
  // Drop area ref for drag and drop
  const dropAreaRef = React.useRef(null);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
    >
      {/* Vehicle info column */}
      <Box 
        sx={{ 
          width: 200, 
          flexShrink: 0, 
          p: 1.5, 
          borderRight: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Tooltip title={`Type: ${vehicle.typeName} | Capacity: ${vehicle.capacity} | Location: ${vehicle.location}`}>
          <Box>
            <Typography variant="body2" noWrap fontWeight="medium">
              {vehicle.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" noWrap>
              {vehicle.licensePlate} • {vehicle.typeName}
            </Typography>
          </Box>
        </Tooltip>
      </Box>
      
      {/* Timeline area */}
      <Box 
        ref={dropAreaRef}
        sx={{ 
          position: 'relative', 
          flexGrow: 1, 
          display: 'flex',
          height: 70,
        }}
      >
        {/* Day cells */}
        {dayCells.map((cell, index) => (
          <Box 
            key={index}
            sx={{ 
              width: dayCellWidth,
              flexShrink: 0,
              height: '100%',
              borderRight: index < dayCells.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              bgcolor: cell.isToday ? 'action.selected' : cell.isWeekend ? 'action.hover' : 'inherit'
            }}
          />
        ))}
        
        {/* Bookings */}
        {bookings.map(booking => (
          <BookingBar
            key={booking.id}
            booking={booking}
            dateRange={dateRange}
            chartWidth={chartWidth}
            onClick={() => onBookingClick(booking)}
            onDrop={onBookingDrop}
            onResize={onBookingResize}
            vehicleId={vehicle.id}
            dropAreaRef={dropAreaRef}
          />
        ))}
      </Box>
    </Box>
  );
};

export default VehicleRow;