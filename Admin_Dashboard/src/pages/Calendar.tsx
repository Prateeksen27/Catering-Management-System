import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBookingStore } from '../store/useBookingStore';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<{ date: string; events: any[] } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAllPendingBookings, pendingBookings } = useBookingStore()

  // Fetch data if pendingBookings is empty
  useEffect(() => {
    const fetchData = async () => {
      if (!pendingBookings || pendingBookings.length === 0) {
        setIsLoading(true);
        try {
          await fetchAllPendingBookings();
        } catch (error) {
          console.error('Error fetching bookings:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [pendingBookings, fetchAllPendingBookings]);

  // Convert bookings to calendar events
  const events = pendingBookings?.map((booking) => ({
    id: booking._id,
    title: booking.eventDetails.eventName,
    date: new Date(booking.eventDetails.eventDate).toISOString().split('T')[0],
    time: booking.eventDetails.eventTime,
    priority: booking.priority,
    clientName: booking.clientDetails.fullName,
    venue: booking.eventDetails.venue,
    color:
      booking.priority === 'High'
        ? 'bg-red-500'
        : booking.priority === 'Medium'
        ? 'bg-yellow-500'
        : 'bg-green-500',
  })) || [];

  const eventTypes = [
    { type: 'High Priority', color: 'bg-red-500' },
    { type: 'Medium Priority', color: 'bg-yellow-500' },
    { type: 'Low Priority', color: 'bg-green-500' },
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    direction === 'prev'
      ? newDate.setMonth(newDate.getMonth() - 1)
      : newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const getEventsForDate = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  const hasEventsForDate = (day: number) => {
    return getEventsForDate(day).length > 0;
  };

  const getPriorityColor = (day: number) => {
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length === 0) return '';
    
    // If multiple events, show the highest priority color
    const hasHighPriority = dayEvents.some(event => event.priority === 'High');
    const hasMediumPriority = dayEvents.some(event => event.priority === 'Medium');
    
    if (hasHighPriority) return 'bg-red-500';
    if (hasMediumPriority) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getEventCountBadge = (day: number) => {
    const dayEvents = getEventsForDate(day);
    const eventCount = dayEvents.length;
    
    if (eventCount === 0) return null;
    
    const badgeColor = getPriorityColor(day);
    
    return (
      <div className={`text-xs text-white px-1.5 py-0.5 rounded-full ${badgeColor} font-medium shadow-sm`}>
        {eventCount}
      </div>
    );
  };

  const handleDateClick = (day: number) => {
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length > 0) {
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDate({
        date: dateString,
        events: dayEvents
      });
      setIsDialogOpen(true);
    }
  };

  // Upcoming Events - Show 5 events closest to today's date
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Calendar</h1>
          <p className="text-muted-foreground">Manage your event schedule and bookings</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }, (_, i) => <div key={i} className="h-20 p-1"></div>)}

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDate(day);
                  const isToday = new Date().getDate() === day &&
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear();
                  const hasEvents = hasEventsForDate(day);

                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`h-20 p-2 border border-border rounded-lg flex flex-col justify-between relative ${
                        hasEvents ? 'cursor-pointer hover:bg-muted/50' : ''
                      } ${
                        isToday ? 'ring-2 ring-primary bg-blue-50' : ''
                      } ${hasEvents ? 'bg-muted/30' : ''}`}
                    >
                      {/* Date and Event Count Badge */}
                      <div className="flex items-center justify-between">
                        <div className={`text-sm font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                          {day}
                        </div>
                        {hasEvents && getEventCountBadge(day)}
                      </div>
                      
                      {/* Empty space - no event names shown */}
                      <div className="flex-1"></div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${event.color}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      event.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {event.priority}
                  </Badge>
                </div>
              )) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Types */}
          <Card>
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {eventTypes.map(item => (
                <div key={item.type} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <Badge variant="secondary">
                    {events.filter(e => {
                      if (item.type === 'High Priority') return e.priority === 'High';
                      if (item.type === 'Medium Priority') return e.priority === 'Medium';
                      return e.priority === 'Low';
                    }).length}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Events on {selectedDate && new Date(selectedDate.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedDate?.events.map((event) => (
              <div key={event.id} className="p-4 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <Badge 
                    className={`${
                      event.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {event.priority}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Client:</strong> {event.clientName}</p>
                  <p><strong>Venue:</strong> {event.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;