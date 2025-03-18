import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider,
  Card,
  CardContent,
  Avatar,
  LinearProgress
} from '@mui/material';
import { 
  DirectionsCar as VehicleIcon, 
  EventAvailable as BookingIcon,
  Timeline as UtilizationIcon,
  Error as AlertIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { format, isWithinInterval, isAfter, addDays } from 'date-fns';

const DashboardStatistics = () => {
  const { bookings, vehicles, currentDate } = useAppContext();

  // Calculate vehicle utilization statistics
  const vehicleUtilizationStats = useMemo(() => {
    const utilization = {};
    const now = new Date();

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

      // Upcoming bookings
      const upcomingBookings = vehicleBookings.filter(booking => 
        isAfter(new Date(booking.startDate), now) && 
        isWithinInterval(new Date(booking.startDate), { 
          start: now, 
          end: addDays(now, 30) 
        })
      );

      utilization[vehicle.id] = {
        vehicle,
        utilizationPercentage,
        upcomingBookingsCount: upcomingBookings.length,
        totalBookings: vehicleBookings.length
      };
    });

    return Object.values(utilization)
      .sort((a, b) => b.utilizationPercentage - a.utilizationPercentage);
  }, [bookings, vehicles]);

  // Overall booking statistics
  const bookingStats = useMemo(() => {
    const now = new Date();

    // Total bookings
    const totalBookings = bookings.length;

    // Upcoming bookings
    const upcomingBookings = bookings.filter(booking => 
      isAfter(new Date(booking.startDate), now) && 
      isWithinInterval(new Date(booking.startDate), { 
        start: now, 
        end: addDays(now, 30) 
      })
    );

    // Booking status breakdown
    const statusBreakdown = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalBookings,
      upcomingBookingsCount: upcomingBookings.length,
      statusBreakdown
    };
  }, [bookings]);

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Dashboard Statistiken
      </Typography>

      {/* Vehicle Utilization Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Fahrzeug-Auslastung
        </Typography>
        {vehicleUtilizationStats.map(({ vehicle, utilizationPercentage, upcomingBookingsCount, totalBookings }) => (
          <Card key={vehicle.id} sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2, bgcolor: utilizationPercentage > 70 ? 'error.main' : 'primary.main' }}>
                <VehicleIcon />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">{vehicle.name} ({vehicle.typeName})</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(utilizationPercentage, 100)}
                  color={utilizationPercentage > 70 ? 'error' : 'primary'}
                  sx={{ height: 10, borderRadius: 5, mt: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption">
                    Auslastung: {utilizationPercentage}%
                  </Typography>
                  <Typography variant="caption">
                    Buchungen: {totalBookings} (Kommende: {upcomingBookingsCount})
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Overall Booking Statistics */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Buchungsübersicht
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BookingIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="subtitle2">Gesamtbuchungen</Typography>
                <Typography variant="h6">{bookingStats.totalBookings}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <UtilizationIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="subtitle2">Kommende Buchungen</Typography>
                <Typography variant="h6">{bookingStats.upcomingBookingsCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AlertIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="subtitle2">Buchungsstatus</Typography>
                {Object.entries(bookingStats.statusBreakdown).map(([status, count]) => (
                  <Typography key={status} variant="body2">
                    {status}: {count}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default DashboardStatistics;
