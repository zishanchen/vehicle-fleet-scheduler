import { addDays, addHours, subDays, format } from 'date-fns';

// Vehicle types and their properties
const vehicleTypes = [
  { id: 'sedan', name: 'Sedan', capacity: 4 },
  { id: 'suv', name: 'SUV', capacity: 5 },
  { id: 'van', name: 'Van', capacity: 7 },
  { id: 'truck', name: 'Truck', capacity: 2 },
  { id: 'luxury', name: 'Luxury', capacity: 4 },
];

// Booking types and their colors
export const bookingTypes = [
  { id: 'maintenance', name: 'Maintenance', color: '#ff9800' },
  { id: 'customer', name: 'Customer Booking', color: '#2196f3' },
  { id: 'service', name: 'Service', color: '#4caf50' },
];

// Booking statuses and their indicators
export const bookingStatuses = [
  { id: 'confirmed', name: 'Confirmed', indicator: 'solid' },
  { id: 'pending', name: 'Pending', indicator: 'dashed' },
  { id: 'completed', name: 'Completed', indicator: 'dotted' },
];

// Locations
const locations = ['North Depot', 'South Depot', 'East Garage', 'West Garage', 'Central Hub'];

// Generate random vehicles
export const generateMockVehicles = (count = 15) => {
  const vehicles = [];

  for (let i = 1; i <= count; i++) {
    const typeIndex = Math.floor(Math.random() * vehicleTypes.length);
    const locationIndex = Math.floor(Math.random() * locations.length);

    vehicles.push({
      id: `v-${i}`,
      name: `Vehicle ${i}`,
      type: vehicleTypes[typeIndex].id,
      typeName: vehicleTypes[typeIndex].name,
      capacity: vehicleTypes[typeIndex].capacity,
      licensePlate: `ABC-${1000 + i}`,
      location: locations[locationIndex],
    });
  }

  return vehicles;
};

// Generate random bookings
export const generateMockBookings = (vehicles, startRange, endRange, count = 40) => {
  const bookings = [];
  const range = Math.floor((endRange - startRange) / (1000 * 60 * 60 * 24));

  for (let i = 1; i <= count; i++) {
    const vehicleIndex = Math.floor(Math.random() * vehicles.length);
    const vehicle = vehicles[vehicleIndex];

    const typeIndex = Math.floor(Math.random() * bookingTypes.length);
    const statusIndex = Math.floor(Math.random() * bookingStatuses.length);

    // Random start date within range
    const dayOffset = Math.floor(Math.random() * range);
    const bookingStart = addHours(addDays(startRange, dayOffset), Math.floor(Math.random() * 12) + 8);

    // Random duration (4 hours to 3 days)
    const durationHours = Math.floor(Math.random() * 68) + 4;
    const bookingEnd = addHours(bookingStart, durationHours);

    bookings.push({
      id: `b-${i}`,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      title: `Booking ${i}`,
      startDate: bookingStart,
      endDate: bookingEnd,
      type: bookingTypes[typeIndex].id,
      typeName: bookingTypes[typeIndex].name,
      color: bookingTypes[typeIndex].color,
      status: bookingStatuses[statusIndex].id,
      statusName: bookingStatuses[statusIndex].name,
      statusIndicator: bookingStatuses[statusIndex].indicator,
      customer: typeIndex === 1 ? `Customer ${Math.floor(Math.random() * 100)}` : null,
      notes: `Notes for booking ${i}`,
    });
  }

  return bookings;
};

// Generate an array of time slots for the Gantt chart
export const generateTimeSlots = (startDate, viewMode, days = 7) => {
  const slots = [];
  const hoursPerSlot = viewMode === 'day' ? 1 : viewMode === 'week' ? 4 : 12;
  const totalSlots = viewMode === 'day' ? 24 : viewMode === 'week' ? days * 6 : days * 2;

  for (let i = 0; i < totalSlots; i++) {
    const slotDate = addHours(startDate, i * hoursPerSlot);
    slots.push({
      date: slotDate,
      label: format(slotDate, hoursPerSlot === 1 ? 'HH:mm' : 'HH:mm'),
    });
  }

  return slots;
};
