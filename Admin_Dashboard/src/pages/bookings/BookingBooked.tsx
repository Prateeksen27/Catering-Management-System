import React, { useEffect } from 'react';
import { CheckCircle, Calendar, Users, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingStore } from '../../store/useBookingStore';
import { IconCurrencyRupee, IconUser } from '@tabler/icons-react';

const BookingBooked: React.FC = () => {
  const { booked, fetchAllBookedEvents } = useBookingStore();
  console.log(booked);

  // ✅ Fetch bookings only once on mount
  useEffect(() => {
    fetchAllBookedEvents();
  }, []);

  // ✅ Render status badges
  const getStatusBadge = (status: string) => {
    const normalized = status?.toLowerCase();
    switch (normalized) {
      case 'confirmed':
        return <Badge className="bg-success text-success-foreground">Confirmed</Badge>;
      case 'deposit-pending':
        return <Badge variant="outline" className="border-warning text-warning">Deposit Pending</Badge>;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Confirmed Bookings</h1>
        <p className="text-muted-foreground">Manage your confirmed event bookings</p>
      </div>

      <div className="grid gap-6">
        {booked.map((booking) => {
          const menuItems = getMenuItems(booking.menu);
          return (
            <Card key={booking._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      {booking.eventName}
                      {getStatusBadge(booking.bookingStatus)}
                    </CardTitle>
                    <p className="text-muted-foreground">Client: {booking.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground flex items-center"><IconCurrencyRupee />{booking.totalAmount || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="font-medium">{new Date(booking.eventDate).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{booking.eventTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Guests</p>
                      <div className='flex items-center'>
                        <IconUser className='w-5 h-5' />
                      <p className="font-medium">{booking.pax || 0} people</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">

                    <div>
                      <p className="text-sm text-muted-foreground">Deposit</p>
                      <div className='flex items-center'>
                        <IconCurrencyRupee />
                        <p className="font-medium">{booking.deposited || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Venue</p>
                  <p className="font-medium">{booking.venue}</p>
                </div>

                {menuItems.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Menu Included</p>
                    <div className="flex flex-wrap gap-2">
                      {menuItems.map((item, index) => (
                        <Badge key={index} variant="secondary">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span className='w-1/2'>Booking ID: {booking.bookingId}</span>
                  <span className='w-1/2 flex justify-end'>
                    Balance: <IconCurrencyRupee className='w-5 h-5 items-center' />
                    {booking.totalAmount - (booking.deposited || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BookingBooked;
