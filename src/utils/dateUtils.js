import { 
  format, 
  isWithinInterval, 
  differenceInCalendarDays, 
  addDays, 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  parseISO,
  isValid
} from 'date-fns';

// Calculate the position and width of a booking bar in the Gantt chart
export const calculateBookingPosition = (booking, startDate, endDate, totalWidth) => {
  const daysInView = differenceInCalendarDays(endDate, startDate) + 1;
  const dayWidth = totalWidth / daysInView;
  
  const bookingStartDate = new Date(booking.startDate);
  const bookingEndDate = new Date(booking.endDate);
  
  // If booking is outside the view
  if (bookingEndDate < startDate || bookingStartDate > endDate) {
    return { visible: false };
  }
  
  // Calculate start position
  const startPos = Math.max(0, differenceInCalendarDays(bookingStartDate, startDate)) * dayWidth;
  
  // Calculate width
  const durationDays = Math.min(
    differenceInCalendarDays(bookingEndDate, bookingStartDate) + 1,
    differenceInCalendarDays(endDate, Math.max(bookingStartDate, startDate)) + 1
  );
  
  const width = durationDays * dayWidth;
  
  return {
    visible: true,
    left: startPos,
    width: width,
  };
};

// Get the date range based on the view mode
export const getDateRangeForView = (currentDate, viewMode) => {
  const date = startOfDay(currentDate);
  switch (viewMode) {
    case 'day':
      return {
        start: date,
        end: endOfDay(date),
      };
    case 'week':
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      };
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    default:
      return {
        start: date,
        end: addDays(date, 7),
      };
  }
};

// Generate header labels for the Gantt chart
export const generateHeaderLabels = (startDate, endDate, viewMode) => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(day => ({
    date: day,
    label: format(day, viewMode === 'month' ? 'd' : 'EEE d'),
    isWeekend: [0, 6].includes(day.getDay()),
  }));
};

// Format a date for display with flexible formatting
export const formatDate = (date, formatString = 'PPP') => {
  // Handle both Date objects and ISO string dates
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  // Validate the date
  return isValid(parsedDate) ? format(parsedDate, formatString) : 'Invalid Date';
};

// Check if a date is within the specified range
export const isDateInRange = (date, startDate, endDate) => {
  // Ensure dates are valid
  const validDate = typeof date === 'string' ? parseISO(date) : date;
  const validStartDate = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const validEndDate = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  return isValid(validDate) && 
         isValid(validStartDate) && 
         isValid(validEndDate) && 
         isWithinInterval(validDate, { start: validStartDate, end: validEndDate });
};

// Calculate duration between two dates in hours
export const calculateDurationInHours = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (!isValid(start) || !isValid(end)) {
    return 0;
  }
  
  return Math.abs(end - start) / (1000 * 60 * 60);
};
