import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tooltip,
  useTheme,
  LinearProgress
} from '@mui/material';
import { useAppContext } from '../context/AppContext';

const VehicleUtilizationHeatmap = () => {
  const theme = useTheme();
  const { bookings, vehicles } = useAppContext();

  // Calculate utilization for each vehicle
  const vehicleUtilization = useMemo(() => {
    const utilization = {};

    vehicles.forEach(vehicle => {
      const vehicleBookings = bookings.filter(b => b.vehicleId === vehicle.id);
      
      // Calculate total booking hours
      const totalBookingHours = vehicleBookings.reduce((total, booking) => {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        const hours = Math.abs(endDate - startDate) / (1000 * 60 * 60);
        return total + hours;
      }, 0);

      // Calculate utilization percentage
      const totalPossibleHours = 30 * 24; // Assuming a month's worth of hours
      const utilizationPercentage = Math.round((totalBookingHours / totalPossibleHours) * 100);

      utilization[vehicle.id] = {
        vehicle,
        utilizationPercentage,
        bookings: vehicleBookings
      };
    });

    return utilization;
  }, [bookings, vehicles]);

  // Get color based on utilization percentage
  const getUtilizationColor = (percentage) => {
    if (percentage < 10) return theme.palette.error.light;
    if (percentage < 20) return theme.palette.warning.light;
    if (percentage < 30) return theme.palette.warning.main;
    if (percentage < 40) return theme.palette.success.light;
    return theme.palette.success.main;
  };

  // Sort vehicles by utilization percentage
  const sortedUtilization = Object.values(vehicleUtilization)
    .sort((a, b) => b.utilizationPercentage - a.utilizationPercentage);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        height: '100%', 
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Typography variant="h6" gutterBottom color="text.primary">
        Vehicle Utilization Heatmap
      </Typography>
      
      <Box sx={{ display: 'grid', gap: 1 }}>
        {sortedUtilization.map(({ vehicle, utilizationPercentage, bookings }) => (
          <Tooltip 
            key={vehicle.id}
            title={
              <Box>
                <Typography variant="subtitle2">{vehicle.name}</Typography>
                <Typography variant="body2">
                  Utilization: {utilizationPercentage}%
                </Typography>
                <Typography variant="caption">
                  Bookings: {bookings.length}
                </Typography>
                {bookings.map(booking => (
                  <Typography 
                    key={booking.id} 
                    variant="caption" 
                    display="block"
                  >
                    {booking.title}: {new Date(booking.startDate).toLocaleString()} - {new Date(booking.endDate).toLocaleString()}
                  </Typography>
                ))}
              </Box>
            }
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  width: 120, 
                  flexShrink: 0,
                  fontWeight: 'medium'
                }}
              >
                {vehicle.name} ({vehicle.typeName})
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(utilizationPercentage, 100)}
                  sx={{
                    height: 20,
                    borderRadius: 1,
                    backgroundColor: theme.palette.grey[300],
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getUtilizationColor(utilizationPercentage)
                    }
                  }}
                />
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  width: 40, 
                  textAlign: 'right',
                  fontWeight: 'bold',
                  color: getUtilizationColor(utilizationPercentage)
                }}
              >
                {utilizationPercentage}%
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Paper>
  );
};

export default VehicleUtilizationHeatmap;
