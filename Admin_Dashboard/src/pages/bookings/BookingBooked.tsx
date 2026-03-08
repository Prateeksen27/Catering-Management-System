import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle, Calendar, MapPin, Search, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookingStore } from '../../store/useBookingStore';
import { IconCurrencyRupee, IconUser } from '@tabler/icons-react';
import { Modal } from '@mantine/core';

const BookingBooked: React.FC = () => {
  const { booked, fetchAllBookedEvents } = useBookingStore();

  // ✅ States for Google Map Modal
  const [mapOpened, setMapOpened] = useState(false);
  const [mapLocation, setMapLocation] = useState('');

  // ✅ Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  // ✅ Fetch bookings on mount
  useEffect(() => {
    fetchAllBookedEvents();
  }, []);

  // ✅ Function to handle map modal open
  const handleOpenMap = (venue: string) => {
    setMapLocation(venue);
    setMapOpened(true);
  };

  // ✅ Render status badges
  const getStatusBadge = (status: string) => {
    const normalized = status?.toLowerCase();
    switch (normalized) {
      case 'confirmed':
        return (
          <Badge className="bg-success text-success-foreground">
            Confirmed
          </Badge>
        );
      case 'deposit-pending':
        return (
          <Badge
            variant="outline"
            className="border-warning text-warning"
          >
            Deposit Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // ✅ Flatten menu items for badges
  const getMenuItems = (menu: any) => {
    if (!menu) return [];
    return [
      ...(menu.starters || []),
      ...(menu.maincourse || []),
      ...(menu.beverages || []),
      ...(menu.desserts || []),
    ];
  };

  // ✅ Get payment status based on amount paid
  const getPaymentStatus = (booking: any): string => {
    const total = booking.totalAmount || 0;
    const deposited = booking.deposited || 0;
    if (deposited === 0) return 'pending';
    if (deposited >= total) return 'paid';
    return 'partial';
  };

  // ✅ Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setPaymentFilter('all');
    setDateFilter('all');
    setSortBy('date-desc');
  };

  // ✅ Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...(booked || [])];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (booking) =>
          booking.clientName?.toLowerCase().includes(query) ||
          booking.eventName?.toLowerCase().includes(query) ||
          booking.phone?.toLowerCase().includes(query) ||
          booking.bookingId?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(
        (booking) => booking.bookingStatus?.toLowerCase() === statusFilter
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(
        (booking) => booking.priority?.toLowerCase() === priorityFilter
      );
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      result = result.filter(
        (booking) => getPaymentStatus(booking) === paymentFilter
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      result = result.filter((booking) => {
        const eventDate = new Date(booking.eventDate);
        eventDate.setHours(0, 0, 0, 0);

        switch (dateFilter) {
          case 'today':
            return eventDate.getTime() === today.getTime();
          case 'week':
            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() + 7);
            return eventDate >= today && eventDate <= weekEnd;
          case 'month':
            const monthEnd = new Date(today);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            return eventDate >= today && eventDate <= monthEnd;
          case 'past':
            return eventDate < today;
          case 'upcoming':
          default:
            return eventDate >= today;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        case 'date-desc':
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        case 'amount-asc':
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        case 'amount-desc':
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case 'guests-asc':
          return (a.pax || 0) - (b.pax || 0);
        case 'guests-desc':
          return (b.pax || 0) - (a.pax || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [booked, searchQuery, statusFilter, priorityFilter, paymentFilter, dateFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Google Map Modal */}
      <Modal
        opened={mapOpened}
        onClose={() => setMapOpened(false)}
        title={`Map - ${mapLocation}`}
        size="70%"
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <iframe
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            mapLocation
          )}&output=embed`}
        ></iframe>
      </Modal>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Upcoming Events</h1>
        <p className="text-muted-foreground">
          Manage your confirmed event bookings
        </p>
      </div>

      {/* ✅ Search and Filter Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-muted/30 p-4 rounded-lg">
        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, event, phone, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Date Filter */}
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Event Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past Events</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="deposit-pending">Deposit Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Filter */}
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Highest Amount</SelectItem>
              <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              <SelectItem value="guests-desc">Most Guests</SelectItem>
              <SelectItem value="guests-asc">Least Guests</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredBookings.length} of {booked?.length || 0} bookings
      </p>

      <div className="grid gap-6">
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No bookings found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
        {filteredBookings.map((booking) => (
          <Card
            key={booking._id}
            className="hover:shadow-md transition-shadow"
          >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      {booking.eventName}
                      {getStatusBadge(booking.bookingStatus)}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Client: {booking.clientName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground flex items-center">
                      <IconCurrencyRupee />
                      {booking.totalAmount || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Date & Time
                      </p>
                      <p className="font-medium">
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.eventTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Guests</p>
                      <div className="flex items-center">
                        <IconUser className="w-5 h-5" />
                        <p className="font-medium">{booking.pax || 0} people</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Deposit</p>
                      <div className="flex items-center">
                        <IconCurrencyRupee />
                        <p className="font-medium">{booking.deposited || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ Venue + Map Button */}
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium flex items-center gap-2">
                    {booking.venue}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenMap(booking.venue)}
                      className="flex items-center gap-1"
                    >
                      <MapPin className="h-4 w-4" />
                      View on Map
                    </Button>
                  </p>
                </div>

                {getMenuItems(booking.menu).length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Menu Included
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getMenuItems(booking.menu).map((item, index) => (
                        <Badge key={index} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span className="w-1/2">Booking ID: {booking.bookingId}</span>
                  <span className="w-1/2 flex justify-end">
                    Balance:{' '}
                    <IconCurrencyRupee className="w-5 h-5 items-center" />
                    {booking.totalAmount - (booking.deposited || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default BookingBooked;
