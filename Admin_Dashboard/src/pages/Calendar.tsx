import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Loader2,
  MapPin,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBookingStore } from "../store/useBookingStore";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<{ date: string; events: any[] } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { fetchAllBookedEvents, booked } = useBookingStore();

  // ✅ Fetch data only once (on mount)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await fetchAllBookedEvents();
        console.log("Fetched booked events", booked);
      } catch (error) {
        console.error("Error fetching booked events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchAllBookedEvents]);

  // ✅ Safely map booked data - removed priority
  const events = useMemo(() => 
    booked?.map((booking) => ({
      id: booking?._id,
      title: booking?.eventName || "Booked Event",
      date: new Date(booking?.eventDate || Date.now()).toISOString().split("T")[0],
      time: booking?.eventTime || "N/A",
      clientName: booking?.clientName || "Unknown Client",
      venue: booking?.venue || "Unknown Venue",
      color: "bg-blue-500",
    })) || [], 
  [booked]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    direction === "prev"
      ? newDate.setMonth(newDate.getMonth() - 1)
      : newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const getEventsForDate = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((event) => event.date === dateString);
  };

  const hasEventsForDate = (day: number) => getEventsForDate(day).length > 0;

  const getPriorityColor = (day: number) => {
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length === 0) return "";
    return "bg-blue-500";
  };

  const getEventCountBadge = (day: number) => {
    const dayEvents = getEventsForDate(day);
    const eventCount = dayEvents.length;
    if (eventCount === 0) return null;
    const badgeColor = getPriorityColor(day);
    return (
      <div
        className={`text-xs text-white px-1.5 py-0.5 rounded-full ${badgeColor} font-medium shadow-sm`}
      >
        {eventCount}
      </div>
    );
  };

  const handleDateClick = (day: number) => {
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length > 0) {
      const dateString = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      setSelectedDate({
        date: dateString,
        events: dayEvents,
      });
      setIsDialogOpen(true);
    }
  };

  // ✅ Get 5 closest events to today (past and future)
  const closestEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .map(event => {
        const eventDate = new Date(event.date);
        const timeDiff = Math.abs(eventDate.getTime() - today.getTime());
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return { ...event, daysDiff };
      })
      .sort((a, b) => a.daysDiff - b.daysDiff)
      .slice(0, 5);
  }, [events]);

  // ✅ Format date with relative day indicator
  const formatEventDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (eventDate.getTime() === today.getTime()) {
      return "Today";
    } else if (eventDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else if (eventDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return eventDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: eventDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

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
      {/* Header - Removed Add Event button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Calendar</h1>
          <p className="text-muted-foreground">
            Manage your confirmed event schedule
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={i} className="h-20 p-1"></div>
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const hasEvents = hasEventsForDate(day);
                  const isToday =
                    new Date().getDate() === day &&
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear();

                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`h-20 p-2 border border-border rounded-lg flex flex-col justify-between relative ${
                        hasEvents ? "cursor-pointer hover:bg-muted/50" : ""
                      } ${isToday ? "ring-2 ring-primary bg-blue-50" : ""} ${
                        hasEvents ? "bg-muted/30" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`text-sm font-semibold ${
                            isToday ? "text-blue-600" : ""
                          }`}
                        >
                          {day}
                        </div>
                        {hasEvents && getEventCountBadge(day)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Closest Events - Scrollable */}
          <Card>
            <CardHeader>
              <CardTitle>Closest Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {closestEvents.length > 0 ? (
                  closestEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 rounded-lg border border-border hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer bg-white"
                      onClick={() => {
                        const eventDate = new Date(event.date);
                        setCurrentDate(eventDate);
                        handleDateClick(eventDate.getDate());
                      }}
                    >
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
                          <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                            {event.title}
                          </h3>
                        </div>
                        {/* Removed the relative time badge */}
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2">
                        {/* Date & Time */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3 flex-shrink-0" />
                          <span>{formatEventDate(event.date)}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>

                        {/* Venue */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>

                        {/* Client */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">{event.clientName}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No events found
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Summary Card Removed */}
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Events on{" "}
              {selectedDate &&
                new Date(selectedDate.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedDate?.events.map((event) => (
              <div
                key={event.id}
                className="p-4 border border-border rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <Badge className="bg-blue-100 text-blue-800">
                    Confirmed
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p>
                    <strong>Client:</strong> {event.clientName}
                  </p>
                  <p>
                    <strong>Venue:</strong> {event.venue}
                  </p>
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