import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { getDateRangeForView, generateHeaderLabels } from '../utils/dateUtils';
import TimeScale from './TimeScale';
import VehicleRow from './VehicleRow';

const GanttChart = ({ onBookingClick }) => {
  const { 
    viewMode, 
    currentDate, 
    zoomLevel, 
    filteredVehicles, 
    bookings, 
    updateBooking, 
    checkBookingConflicts 
  } = useAppContext();
  
  const [dateRange, setDateRange] = useState(getDateRangeForView(currentDate, viewMode));
  const [headerLabels, setHeaderLabels] = useState([]);
  const [chartWidth, setChartWidth] = useState(0);
  
  const chartRef = useRef(null);
  
  // Update date range when view mode or current date changes
  useEffect(() => {
    const newDateRange = getDateRangeForView(currentDate, viewMode);
    setDateRange(newDateRange);
    setHeaderLabels(generateHeaderLabels(newDateRange.start, newDateRange.end, viewMode));
  }, [viewMode, currentDate]);
  
  // Update chart width when ref is available or zoom level changes
  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.offsetWidth - 200); // 200px for vehicle info column
    }
  }, [chartRef, zoomLevel]);
  
  // Filter bookings for visible vehicles
  const visibleBookings = bookings.filter(booking => 
    filteredVehicles.some(vehicle => vehicle.id === booking.vehicleId)
  );
  
  // Handle drag and drop of bookings
  const handleBookingDrop = (bookingId, newVehicleId, newStartDate, newEndDate) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Check for conflicts
    const hasConflict = checkBookingConflicts(newVehicleId, newStartDate, newEndDate, bookingId);
    if (hasConflict) {
      // Show conflict warning - could be implemented with a toast notification
      console.warn('Booking conflict detected');
      return;
    }
    
    // Update the booking
    const updatedBooking = {
      ...booking,
      vehicleId: newVehicleId,
      startDate: newStartDate,
      endDate: newEndDate
    };
    
    updateBooking(updatedBooking);
  };
  
  // Handle resize of booking
  const handleBookingResize = (bookingId, newStartDate, newEndDate) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Check for conflicts
    const hasConflict = checkBookingConflicts(booking.vehicleId, newStartDate, newEndDate, bookingId);
    if (hasConflict) {
      console.warn('Booking conflict detected');
      return;
    }
    
    // Update the booking
    const updatedBooking = {
      ...booking,
      startDate: newStartDate,
      endDate: newEndDate
    };
    
    updateBooking(updatedBooking);
  };
  
  return (
    <Paper 
      ref={chartRef}
      elevation={2} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <TimeScale 
        dateRange={dateRange} 
        viewMode={viewMode} 
        headerLabels={headerLabels}
        width={chartWidth}
      />
      
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        {filteredVehicles.map(vehicle => (
          <VehicleRow 
            key={vehicle.id}
            vehicle={vehicle}
            dateRange={dateRange}
            bookings={visibleBookings.filter(b => b.vehicleId === vehicle.id)}
            chartWidth={chartWidth}
            onBookingClick={onBookingClick}
            onBookingDrop={handleBookingDrop}
            onBookingResize={handleBookingResize}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default GanttChart;
