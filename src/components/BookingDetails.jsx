import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid, 
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { formatDate } from '../utils/dateUtils';
import { bookingTypes, bookingStatuses } from '../utils/mockData';
import { useAppContext } from '../context/AppContext';

const BookingDetails = ({ booking, open, onClose }) => {
  const { vehicles, updateBooking } = useAppContext();
  
  // Initialize hooks unconditionally - not inside conditional statements
  const [formValues, setFormValues] = useState({});
  
  // Initialize form values when booking changes
  useEffect(() => {
    if (booking) {
      setFormValues({
        title: booking.title,
        vehicleId: booking.vehicleId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        type: booking.type,
        status: booking.status,
        customer: booking.customer || '',
        notes: booking.notes || ''
      });
    }
  }, [booking]);
  
  // Only return early after all hooks have been declared
  if (!booking) {
    return (
      <Dialog open={false}>
        <DialogContent />
      </Dialog>
    );
  }
  
  // Handle form value changes
  const handleChange = (name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Update the booking
    const updatedBooking = {
      ...booking,
      ...formValues,
      typeName: bookingTypes.find(t => t.id === formValues.type)?.name,
      color: bookingTypes.find(t => t.id === formValues.type)?.color,
      statusName: bookingStatuses.find(s => s.id === formValues.status)?.name,
      statusIndicator: bookingStatuses.find(s => s.id === formValues.status)?.indicator
    };
    
    updateBooking(updatedBooking);
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Booking Details</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Booking title */}
          <Grid item xs={12}>
            <TextField
              label="Booking Title"
              fullWidth
              value={formValues.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </Grid>
          
          {/* Vehicle selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Vehicle</InputLabel>
              <Select
                value={formValues.vehicleId || ''}
                label="Vehicle"
                onChange={(e) => handleChange('vehicleId', e.target.value)}
              >
                {vehicles.map(vehicle => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.typeName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
                    {/* Booking type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Booking Type</InputLabel>
              <Select
                value={formValues.type || ''}
                label="Booking Type"
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {bookingTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Start date/time */}
          <Grid item xs={12} md={6}>
            <DateTimePicker 
              label="Start Date & Time"
              value={formValues.startDate}
              onChange={(date) => handleChange('startDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true
                }
              }}
            />
          </Grid>
          
          {/* End date/time */}
          <Grid item xs={12} md={6}>
            <DateTimePicker 
              label="End Date & Time"
              value={formValues.endDate}
              onChange={(date) => handleChange('endDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true
                }
              }}
            />
          </Grid>
          
          {/* Booking status */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formValues.status || ''}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {bookingStatuses.map(status => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Customer (only shown for customer bookings) */}
          {formValues.type === 'customer' && (
            <Grid item xs={12} md={6}>
              <TextField
                label="Customer"
                fullWidth
                value={formValues.customer || ''}
                onChange={(e) => handleChange('customer', e.target.value)}
              />
            </Grid>
          )}
          
          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={4}
              value={formValues.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetails;
