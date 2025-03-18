import { useState, useEffect, useCallback } from 'react';
import { addMinutes, differenceInMinutes } from 'date-fns';
import { useAppContext } from '../context/AppContext';

const useDragDrop = (bookingRef, dropAreaRef, booking, dateRange, chartWidth) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState(null);
  const [resizeStartPos, setResizeStartPos] = useState(null);
  const [resizeStartDate, setResizeStartDate] = useState(null);
  
  const { updateBooking, checkBookingConflicts } = useAppContext();
  
  // Drag start handler
  const handleDragStart = useCallback((e) => {
    if (isResizing || !bookingRef.current) return;
    
    // Set booking data for transfer
    e.dataTransfer.setData('application/json', JSON.stringify({
      bookingId: booking.id,
      vehicleId: booking.vehicleId,
      originalStart: booking.startDate,
      originalEnd: booking.endDate,
      duration: differenceInMinutes(booking.endDate, booking.startDate)
    }));
    
    // Create drag ghost image
    const rect = bookingRef.current.getBoundingClientRect();
    const ghost = document.createElement('div');
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.backgroundColor = booking.color;
    ghost.style.opacity = '0.7';
    ghost.style.borderRadius = '4px';
    ghost.style.display = 'flex';
    ghost.style.alignItems = 'center';
    ghost.style.justifyContent = 'center';
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    ghost.style.left = '-1000px';
    ghost.style.pointerEvents = 'none';
    
    // Add booking title to ghost image
    const titleElement = document.createElement('span');
    titleElement.textContent = booking.title;
    titleElement.style.color = 'white';
    titleElement.style.fontWeight = 'bold';
    ghost.appendChild(titleElement);
    
    document.body.appendChild(ghost);
    
    // Set drag image
    e.dataTransfer.setDragImage(ghost, rect.width / 2, rect.height / 2);
    
    // Clean up ghost element
    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);
    
    setIsDragging(true);
    bookingRef.current.classList.add('dragging');
  }, [booking, isResizing, bookingRef]);
  
  // Drag end handler
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    
    if (bookingRef.current) {
      bookingRef.current.classList.remove('dragging');
    }
  }, [bookingRef]);
  
  // Drop handler
  const handleDrop = useCallback((e, vehicleId) => {
    e.preventDefault();
    
    if (!dropAreaRef.current) return;
    
    dropAreaRef.current.classList.remove('drag-over');
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (!data || !data.bookingId) return;
      
      // Calculate drop position
      const rect = dropAreaRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      
      // Convert position to date
      const daysInView = (dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24);
      const dayWidth = chartWidth / daysInView;
      const dayOffset = relativeX / dayWidth;
      
      // Calculate new dates
      const dropDate = new Date(dateRange.start);
      dropDate.setDate(dropDate.getDate() + dayOffset);
      
      const newEndDate = addMinutes(dropDate, data.duration);
      
      // Enhanced conflict checking
      const hasConflict = checkBookingConflicts(
        vehicleId, 
        dropDate, 
        newEndDate, 
        data.bookingId
      );
      
      if (hasConflict) {
        console.warn('Booking conflicts with existing bookings');
        return;
      }
      
      // Update booking
      updateBooking({
        ...booking,
        vehicleId: vehicleId,
        startDate: dropDate,
        endDate: newEndDate
      });
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [booking, chartWidth, dateRange, dropAreaRef, updateBooking, checkBookingConflicts]);
  
  // Resize start handler - always defined
  const handleResizeStart = useCallback((edge, e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeEdge(edge);
    setResizeStartPos(e.clientX);
    setResizeStartDate(edge === 'start' ? new Date(booking.startDate) : new Date(booking.endDate));
    
    const handleResizeMove = (moveEvent) => {
      if (!isResizing || !resizeStartPos || !bookingRef.current) return;
      
      const diff = moveEvent.clientX - resizeStartPos;
      const rect = dropAreaRef.current.getBoundingClientRect();
      const pixelsPerDay = chartWidth / ((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24));
      const daysDiff = diff / pixelsPerDay;
      
      // Apply a visual preview of the resize
      if (resizeEdge === 'start') {
        bookingRef.current.style.left = `${parseInt(bookingRef.current.style.left || 0) + diff}px`;
        bookingRef.current.style.width = `${parseInt(bookingRef.current.style.width || 0) - diff}px`;
      } else {
        bookingRef.current.style.width = `${parseInt(bookingRef.current.style.width || 0) + diff}px`;
      }
      
      setResizeStartPos(moveEvent.clientX);
    };
    
    const handleResizeEnd = (endEvent) => {
      if (!isResizing || !resizeStartDate || !bookingRef.current) return;
      
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      
      // Reset the visual style
      bookingRef.current.style.left = '';
      bookingRef.current.style.width = '';
      
      const diff = endEvent.clientX - resizeStartPos;
      const rect = dropAreaRef.current.getBoundingClientRect();
      const pixelsPerDay = chartWidth / ((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24));
      const daysDiff = diff / pixelsPerDay;
      
      // Calculate the new dates
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const dateDiff = daysDiff * millisecondsPerDay;
      
      let newStartDate = new Date(booking.startDate);
      let newEndDate = new Date(booking.endDate);
      
      if (resizeEdge === 'start') {
        newStartDate = new Date(resizeStartDate.getTime() + dateDiff);
        
        // Ensure the start date is not after the end date
        if (newStartDate >= newEndDate) {
          newStartDate = new Date(newEndDate);
          newStartDate.setHours(newStartDate.getHours() - 1);
        }
      } else {
        newEndDate = new Date(resizeStartDate.getTime() + dateDiff);
        
        // Ensure the end date is not before the start date
        if (newEndDate <= newStartDate) {
          newEndDate = new Date(newStartDate);
          newEndDate.setHours(newEndDate.getHours() + 1);
        }
      }
      
      // Check for conflicts
      const hasConflict = checkBookingConflicts(
        booking.vehicleId, 
        newStartDate, 
        newEndDate, 
        booking.id
      );
      
      if (hasConflict) {
        console.warn('Booking conflict detected');
        setIsResizing(false);
        setResizeEdge(null);
        setResizeStartPos(null);
        setResizeStartDate(null);
        return;
      }
      
      // Update the booking
      updateBooking({
        ...booking,
        startDate: newStartDate,
        endDate: newEndDate
      });
      
      setIsResizing(false);
      setResizeEdge(null);
      setResizeStartPos(null);
      setResizeStartDate(null);
      
      // Add event listeners for resize
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    };
  }, [
    booking, 
    bookingRef, 
    chartWidth, 
    dateRange, 
    dropAreaRef, 
    isResizing, 
    resizeEdge, 
    resizeStartDate, 
    resizeStartPos, 
    updateBooking, 
    checkBookingConflicts
  ]);
  
  // Set up drag-over events for the drop area
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    
    if (!dropArea) return;
    
    const handleDragOver = (e) => {
      e.preventDefault();
      dropArea.classList.add('drag-over');
    };
    
    const handleDragLeave = () => {
      dropArea.classList.remove('drag-over');
    };
    
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    
    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
    };
  }, [dropAreaRef]);
  
  return {
    isDragging,
    isResizing,
    resizeEdge,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleResizeStart
  };
};

export default useDragDrop;
