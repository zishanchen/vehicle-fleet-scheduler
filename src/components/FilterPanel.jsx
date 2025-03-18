import React from 'react';
import { 
  Paper, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Grid,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useAppContext } from '../context/AppContext';
import { bookingTypes, bookingStatuses } from '../utils/mockData';

const FilterPanel = () => {
  const { filters, setFilters, vehicles } = useAppContext();
  
  // Extract unique vehicle types
  const vehicleTypes = [...new Set(vehicles.map(v => v.type))];
  
  // Sorting options
  const sortOptions = [
    { value: 'utilizationDesc', label: 'Auslastung (absteigend)' },
    { value: 'utilizationAsc', label: 'Auslastung (aufsteigend)' },
    { value: 'nameAsc', label: 'Name (A-Z)' },
    { value: 'nameDesc', label: 'Name (Z-A)' }
  ];
  
  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date range changes
  const handleDateRangeChange = (field, date) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: date
      }
    }));
  };
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        borderBottom: '1px solid', 
        borderColor: 'divider'
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Vehicle type filter */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="vehicle-type-label">Fahrzeugtyp</InputLabel>
            <Select
              labelId="vehicle-type-label"
              id="vehicle-type-select"
              value={filters.vehicleType}
              label="Fahrzeugtyp"
              onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
            >
              <MenuItem value="all">Alle Typen</MenuItem>
              {vehicleTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Booking status filter */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="booking-status-label">Buchungsstatus</InputLabel>
            <Select
              labelId="booking-status-label"
              id="booking-status-select"
              value={filters.bookingStatus}
              label="Buchungsstatus"
              onChange={(e) => handleFilterChange('bookingStatus', e.target.value)}
            >
              <MenuItem value="all">Alle Status</MenuItem>
              {bookingStatuses.map(status => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Booking type filter */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="booking-type-label">Buchungstyp</InputLabel>
            <Select
              labelId="booking-type-label"
              id="booking-type-select"
              value={filters.bookingType}
              label="Buchungstyp"
              onChange={(e) => handleFilterChange('bookingType', e.target.value)}
            >
              <MenuItem value="all">Alle Typen</MenuItem>
              {bookingTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Sorting filter */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="sort-label">Sortieren nach</InputLabel>
            <Select
              labelId="sort-label"
              id="sort-select"
              value={filters.sortBy}
              label="Sortieren nach"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Date range filter */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DatePicker 
              label="Von"
              value={filters.dateRange.start}
              onChange={(date) => handleDateRangeChange('start', date)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true
                }
              }}
            />
            <DatePicker 
              label="Bis"
              value={filters.dateRange.end}
              onChange={(date) => handleDateRangeChange('end', date)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
      
      {/* Legend */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="subtitle2">Legende:</Typography>
        {bookingTypes.map(type => (
          <Chip 
            key={type.id}
            label={type.name}
            size="small"
            sx={{ 
              bgcolor: type.color,
              color: 'white',
              '& .MuiChip-label': {
                fontWeight: 'bold'
              }
            }}
          />
        ))}
        
        {bookingStatuses.map(status => (
          <Chip 
            key={status.id}
            label={status.name}
            variant="outlined"
            size="small"
            sx={{ 
              borderStyle: status.indicator,
              borderWidth: 2
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default FilterPanel;
