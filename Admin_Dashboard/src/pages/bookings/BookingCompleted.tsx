import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle2, Download, Eye, Calendar, MapPin, Users, Truck, ChefHat, BadgeIndianRupee, Clock, User, Phone, Utensils, Package, Activity, Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookingStore } from '../../store/useBookingStore';

interface BookingDetails {
  _id?: string;
  bookingId?: string;
  eventName?: string;
  clientName?: string;
  phone?: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  pax?: number;
  numberOfGuests?: number;
  totalAmount?: number;
  balance?: number;
  paymentStatus?: string;
  paymentDetails?: any;
  menu?: {
    starters?: string[];
    maincourse?: string[];
    beverages?: string[];
    desserts?: string[];
  };
  assignedStaffDetails?: {
    manager?: any[];
    chefs?: any[];
    workers?: any[];
    drivers?: any[];
  };
  assignedVehicles?: any[];
  goodsUsed?: any[];
  timeline?: any[];
}

const BookingCompleted: React.FC = () => {
  const { fetchAllBookedEvents, booked } = useBookingStore()
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ✅ Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  useEffect(() => {
    fetchAllBookedEvents()
  }, [])

  const handleViewDetails = (booking: BookingDetails) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return 'N/A'
    return timeStr
  }

  // ✅ Get payment status based on amount paid
  const getPaymentStatus = (booking: any): string => {
    const total = booking.totalAmount || 0;
    const balance = booking.balance || 0;
    const paid = total - balance;
    if (paid >= total && total > 0) return 'paid';
    if (paid > 0) return 'partial';
    return 'pending';
  };

  // ✅ Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
    setPaymentFilter('all');
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
          booking._id?.toLowerCase().includes(query)
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
          return (a.numberOfGuests || a.pax || 0) - (b.numberOfGuests || b.pax || 0);
        case 'guests-desc':
          return (b.numberOfGuests || b.pax || 0) - (a.numberOfGuests || a.pax || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [booked, searchQuery, paymentFilter, dateFilter, sortBy]);

  const getPaymentStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-600">Paid</Badge>
      case 'partial':
        return <Badge className="bg-yellow-600">Partial</Badge>
      default:
        return <Badge variant="secondary">Unpaid</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Completed Bookings</h1>
        <p className="text-muted-foreground">Successfully completed events from the Booked collection</p>
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
          <Card className="p-8">
            <CardContent className="flex flex-col items-center justify-center text-center py-12">
              <CheckCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No completed events found.</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
        {filteredBookings.map((booking) => (
          <Card key={booking._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      {booking.eventName}
                    </CardTitle>
                    <p className="text-muted-foreground">Client: {booking.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground flex items-center justify-end gap-1">
                      <BadgeIndianRupee className="h-5 w-5" />
                      {booking.totalAmount || booking.totalPrice || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Event Date</p>
                      <p className="font-medium">
                        {booking.eventDate 
                          ? new Date(booking.eventDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) 
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p className="font-medium">{booking.venue || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Guests</p>
                      <p className="font-medium">{booking.numberOfGuests || booking.guestCount || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Menu Delivered</p>
                      <p className="font-medium">{booking.menuDelivered ? 'Yes' : 'Pending'}</p>
                    </div>
                  </div>
                  {booking.assignedStaff && booking.assignedStaff.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned Staff</p>
                        <p className="font-medium">{booking.assignedStaff.length} staff members</p>
                      </div>
                    </div>
                  )}
                  {booking.assignedVehicles && booking.assignedVehicles.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned Vehicles</p>
                        <p className="font-medium">{booking.assignedVehicles.length} vehicles</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    Booking ID: {booking._id}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* View Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Completed Event Details
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Event Information */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Event Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Event Name</p>
                    <p className="font-medium">{selectedBooking.eventName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booking ID</p>
                    <p className="font-medium">{selectedBooking.bookingId || selectedBooking._id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(selectedBooking.eventDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{formatTime(selectedBooking.eventTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-medium">{selectedBooking.venue || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{selectedBooking.pax || selectedBooking.numberOfGuests || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Client Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Client Name</p>
                    <p className="font-medium">{selectedBooking.clientName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{selectedBooking.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BadgeIndianRupee className="h-4 w-4" />
                  Payment Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium">₹{selectedBooking.totalAmount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="font-medium">₹{(selectedBooking.totalAmount || 0) - (selectedBooking.balance || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-medium">₹{selectedBooking.balance || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Menu
                </h3>
                <div className="space-y-3">
                  {Array.isArray(selectedBooking.menu?.starters) && selectedBooking.menu.starters.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Starters</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedBooking.menu.starters.map((item: string, idx: number) => (
                          <Badge key={idx} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {Array.isArray(selectedBooking.menu?.maincourse) && selectedBooking.menu.maincourse.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Main Course</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedBooking.menu.maincourse.map((item: string, idx: number) => (
                          <Badge key={idx} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {Array.isArray(selectedBooking.menu?.beverages) && selectedBooking.menu.beverages.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Beverages</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedBooking.menu.beverages.map((item: string, idx: number) => (
                          <Badge key={idx} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {Array.isArray(selectedBooking.menu?.desserts) && selectedBooking.menu.desserts.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Desserts</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedBooking.menu.desserts.map((item: string, idx: number) => (
                          <Badge key={idx} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {!Array.isArray(selectedBooking.menu?.starters)?.length && 
                   !Array.isArray(selectedBooking.menu?.maincourse)?.length && 
                   !Array.isArray(selectedBooking.menu?.beverages)?.length && 
                   !Array.isArray(selectedBooking.menu?.desserts)?.length && (
                    <p className="text-muted-foreground italic">No menu details available</p>
                  )}
                </div>
              </div>

              {/* Assigned Staff */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Assigned Staff
                </h3>
                <div className="space-y-3">
                  {/* Check for assignedStaff array format */}
                  {Array.isArray(selectedBooking.assignedStaff) && selectedBooking.assignedStaff.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedBooking.assignedStaff.map((staff: any, idx: number) => (
                        <Badge key={idx} className="bg-blue-600">
                          {staff.name || staff.role || 'Staff'} - {staff.role || 'Team Member'}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No staff assigned</p>
                  )}
                </div>
              </div>

              {/* Vehicles */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Vehicles Used
                </h3>
                {Array.isArray(selectedBooking.assignedVehicles) && selectedBooking.assignedVehicles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.assignedVehicles.map((v: any, idx: number) => (
                      <Badge key={idx} className="bg-slate-600">
                        {v.vehicleName || v.name || 'Vehicle'} - {v.vehicleNumber || v.number || ''}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No vehicles assigned</p>
                )}
              </div>

              {/* Goods/Equipment Used */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Goods / Equipment Used
                </h3>
                {Array.isArray(selectedBooking.goodsUsed) && selectedBooking.goodsUsed.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.goodsUsed.map((g: any, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {g.itemName || g.name || 'Item'} - {g.quantity || 0}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No goods used</p>
                )}
              </div>

              {/* Event Timeline */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Event Timeline
                </h3>
                {Array.isArray(selectedBooking.timeline) && selectedBooking.timeline.length > 0 ? (
                  <div className="space-y-3">
                    {selectedBooking.timeline.map((t: any, idx: number) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{t.action || t.title || 'Action'}</p>
                          <p className="text-muted-foreground text-xs">
                            {t.timestamp ? new Date(t.timestamp).toLocaleString('en-IN') : ''}
                            {t.performedBy && ` • ${t.performedBy}`}
                          </p>
                          {t.notes && <p className="text-muted-foreground mt-1">{t.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No timeline available</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingCompleted;
