import React, { useRef, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Tooltip,
  darken
} from '@mui/material';
import { formatDate, calculateBookingPosition } from '../utils/dateUtils';
import useDragDrop from '../hooks/useDragDrop';

const BookingBar = ({ 
  booking, 
  dateRange, 
  chartWidth, 
  onClick, 
  onDrop,
  onResize,
  vehicleId,
  dropAreaRef
}) => {
  // Always create ref
  const bookingRef = useRef(null);
  
  // Always calculate position using useMemo
  const position = useMemo(() => calculateBookingPosition(
    booking, 
    dateRange.start, 
    dateRange.end, 
    chartWidth
  ), [booking, dateRange.start, dateRange.end, chartWidth]);
  
  // Always use drag drop hook
  const {
    isDragging,
    isResizing,
    resizeEdge,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleResizeStart: hookHandleResizeStart
  } = useDragDrop(bookingRef, dropAreaRef, booking, dateRange, chartWidth);
  
  // Memoize border style function
  const getBorderStyle = useCallback((status) => {
    switch (status) {
      case 'confirmed':
        return 'solid';
      case 'pending':
        return 'dashed';
      case 'completed':
        return 'dotted';
      default:
        return 'solid';
    }
  }, []);
  
  // Always create resize start handler
  const handleResizeStart = useCallback((edge, e) => {
    if (hookHandleResizeStart) {
      hookHandleResizeStart(edge, e);
    }
  }, [hookHandleResizeStart]);
  
  // If booking is not visible, return null after all hooks
  if (!position.visible) return null;
  
  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2">{booking.title}</Typography>
          <Typography variant="body2">{booking.typeName} - {booking.statusName}</Typography>
          <Typography variant="caption">
            {formatDate(booking.startDate, "MMM d, HH:mm")} - {formatDate(booking.endDate, "MMM d, HH:mm")}
          </Typography>
          {booking.customer && (
            <Typography variant="caption" display="block">
              Customer: {booking.customer}
            </Typography>
          )}
        </Box>
      }
    >
      <Box
        ref={bookingRef}
        draggable={!isResizing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={onClick}
        sx={{
          position: 'absolute',
          left: position.left,
          width: position.width,
          height: 60,
          top: 5,
          backgroundColor: booking.color,
          borderRadius: 1,
          boxShadow: isDragging ? 'none' : 2,
          opacity: isDragging ? 0.5 : 1,
          border: `2px ${getBorderStyle(booking.status)} ${darken(booking.color, 0.2)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: isResizing ? (resizeEdge === 'start' ? 'w-resize' : 'e-resize') : 'move',
          transition: isDragging ? 'none' : 'all 0.2s ease',
          '&:hover': {
            boxShadow: 4,
            '& .resizeHandle': {
              opacity: 1
            }
          }
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            textShadow: '0 0 2px rgba(0,0,0,0.5)',
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'center',
            px: 1
          }}
        >
          {booking.title}
        </Typography>
        
        {/* Resize handles */}
        <Box
          className="resizeHandle"
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 8,
            height: '100%',
            cursor: 'w-resize',
            opacity: 0,
            '&:hover': {
              opacity: 1
            }
          }}
          onMouseDown={(e) => handleResizeStart('start', e)}
        />
        <Box
          className="resizeHandle"
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 8,
            height: '100%',
            cursor: 'e-resize',
            opacity: 0,
            '&:hover': {
              opacity: 1
            }
          }}
          onMouseDown={(e) => handleResizeStart('end', e)}
        />
      </Box>
    </Tooltip>
  );
};

export default BookingBar;
