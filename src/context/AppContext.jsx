import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { addDays, startOfDay } from 'date-fns';
import { generateMockVehicles, generateMockBookings } from '../utils/mockData';

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // State for view settings
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // State for data
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  
  // State for filters
  const [filters, setFilters] = useState({
    vehicleType: 'all',
    bookingStatus: 'all',
    bookingType: 'all',
    dateRange: {
      start: currentDate,
      end: addDays(currentDate, 28),
    },
    sortBy: 'utilizationDesc'
  });
  
  // Load mock data
  useEffect(() => {
    const mockVehicles = generateMockVehicles();
    const mockBookings = generateMockBookings(mockVehicles, filters.dateRange.start, filters.dateRange.end);
    
    setVehicles(mockVehicles);
    setBookings(mockBookings);
    setFilteredVehicles(mockVehicles);
  }, []);
  
  // Advanced filtering and sorting
  const processedData = useMemo(() => {
    let processedVehicles = [...vehicles];
    let processedBookings = [...bookings];
    
    // Filter by vehicle type
    if (filters.vehicleType !== 'all') {
      processedVehicles = processedVehicles.filter(vehicle => vehicle.type === filters.vehicleType);
      processedBookings = processedBookings.filter(booking => 
        processedVehicles.some(vehicle => vehicle.id === booking.vehicleId)
      );
    }
    
    // Filter by booking status
    if (filters.bookingStatus !== 'all') {
      processedBookings = processedBookings.filter(booking => booking.status === filters.bookingStatus);
    }
    
    // Filter by booking type
    if (filters.bookingType !== 'all') {
      processedBookings = processedBookings.filter(booking => booking.type === filters.bookingType);
    }
    
    // Filter by date range
    processedBookings = processedBookings.filter(booking => 
      new Date(booking.startDate) >= filters.dateRange.start &&
      new Date(booking.endDate) <= filters.dateRange.end
    );
    
    // Sorting
    const vehicleUtilization = processedVehicles.map(vehicle => {
      const vehicleBookings = processedBookings.filter(b => b.vehicleId === vehicle.id);
      const totalBookingHours = vehicleBookings.reduce((total, booking) => {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        const hours = Math.abs(endDate - startDate) / (1000 * 60 * 60);
        return total + hours;
      }, 0);
      
      return {
        ...vehicle,
        utilizationPercentage: Math.round((totalBookingHours / (30 * 24)) * 100),
        bookingsCount: vehicleBookings.length
      };
    });
    
    // Sort vehicles
    switch(filters.sortBy) {
      case 'utilizationDesc':
        processedVehicles = vehicleUtilization
          .sort((a, b) => b.utilizationPercentage - a.utilizationPercentage)
          .map(v => ({
            ...v,
            utilizationPercentage: undefined,
            bookingsCount: undefined
          }));
        break;
      case 'utilizationAsc':
        processedVehicles = vehicleUtilization
          .sort((a, b) => a.utilizationPercentage - b.utilizationPercentage)
          .map(v => ({
            ...v,
            utilizationPercentage: undefined,
            bookingsCount: undefined
          }));
        break;
      case 'nameAsc':
        processedVehicles.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        processedVehicles.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    return {
      vehicles: processedVehicles,
      bookings: processedBookings
    };
  }, [vehicles, bookings, filters]);
  
  // Update filtered vehicles when processed data changes
  useEffect(() => {
    setFilteredVehicles(processedData.vehicles);
  }, [processedData]);
  
  // Generate report method
  const generateReport = useCallback(() => {
    const report = {
      generatedAt: new Date(),
      totalVehicles: vehicles.length,
      totalBookings: bookings.length,
      vehicleTypes: {},
      bookingStatuses: {},
      utilization: processedData.vehicles.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        type: vehicle.type,
        bookingsCount: bookings.filter(b => b.vehicleId === vehicle.id).length
      }))
    };
    
    // Count vehicle types
    vehicles.forEach(vehicle => {
      report.vehicleTypes[vehicle.type] = 
        (report.vehicleTypes[vehicle.type] || 0) + 1;
    });
    
    // Count booking statuses
    bookings.forEach(booking => {
      report.bookingStatuses[booking.status] = 
        (report.bookingStatuses[booking.status] || 0) + 1;
    });
    
    return report;
  }, [vehicles, bookings, processedData]);
  
  // Update booking
  const updateBooking = useCallback((updatedBooking) => {
    setBookings(prev => prev.map(booking => 
      booking.id === updatedBooking.id ? updatedBooking : booking
    ));
  }, []);
  
  // Add a new booking
  const addBooking = useCallback((newBooking) => {
    setBookings(prev => [...prev, newBooking]);
  }, []);
  
  // Check for booking conflicts
  const checkBookingConflicts = useCallback((vehicleId, startDate, endDate, bookingIdToIgnore) => {
    return bookings.some(booking => 
      booking.vehicleId === vehicleId &&
      booking.id !== bookingIdToIgnore &&
      ((startDate >= booking.startDate && startDate < booking.endDate) || 
       (endDate > booking.startDate && endDate <= booking.endDate) ||
       (startDate <= booking.startDate && endDate >= booking.endDate))
    );
  }, [bookings]);
  
  // Context value
  const value = {
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    zoomLevel,
    setZoomLevel,
    vehicles,
    filteredVehicles,
    bookings,
    filters,
    setFilters,
    updateBooking,
    addBooking,
    generateReport,
    processedData,
    checkBookingConflicts
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
