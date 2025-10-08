import React from 'react';
import { CheckCircle, Calendar, Users, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BookingBooked: React.FC = () => {
  const bookedEvents = [
    {
      id: 'BK001',
      customerName: 'Alice Wilson',
      event: 'Wedding Ceremony',
      date: '2024-06-20',
      time: '2:00 PM - 10:00 PM',
      guests: 120,
      amount: '$4,500',
      deposit: '$1,350',
      status: 'confirmed',
      venue: 'Grand Hotel Ballroom',
      services: ['Photography', 'Catering', 'Decoration']
    },
    {
      id: 'BK002',
      customerName: 'Robert Chen',
      event: 'Corporate Gala',
      date: '2024-07-15',
      time: '6:00 PM - 11:00 PM',
      guests: 250,
      amount: '$12,000',
      deposit: '$3,600',
      status: 'confirmed',
      venue: 'Convention Center',
      services: ['Full Event Management', 'Catering', 'AV Equipment']
    },
    {
      id: 'BK003',
      customerName: 'Jessica Martinez',
      event: 'Birthday Celebration',
      date: '2024-05-25',
      time: '7:00 PM - 12:00 AM',
      guests: 80,
      amount: '$2,800',
      deposit: '$840',
      status: 'deposit-pending',
      venue: 'Garden Restaurant',
      services: ['Catering', 'Entertainment', 'Decoration']
    },
    {
      id: 'BK004',
      customerName: 'David Thompson',
      event: 'Conference',
      date: '2024-08-10',
      time: '9:00 AM - 5:00 PM',
      guests: 180,
      amount: '$8,500',
      deposit: '$2,550',
      status: 'confirmed',
      venue: 'Business Center',
      services: ['Venue Setup', 'Catering', 'Technical Support']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-success text-success-foreground">Confirmed</Badge>;
      case 'deposit-pending':
        return <Badge variant="outline" className="border-warning text-warning">Deposit Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Confirmed Bookings</h1>
        <p className="text-muted-foreground">Manage your confirmed event bookings</p>
      </div>

      <div className="grid gap-6">
        {bookedEvents.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    {booking.event}
                    {getStatusBadge(booking.status)}
                  </CardTitle>
                  <p className="text-muted-foreground">Client: {booking.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{booking.amount}</p>
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
                    <p className="font-medium">{booking.date}</p>
                    <p className="text-sm text-muted-foreground">{booking.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{booking.guests} people</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deposit</p>
                    <p className="font-medium">{booking.deposit}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Venue</p>
                <p className="font-medium">{booking.venue}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Services Included</p>
                <div className="flex flex-wrap gap-2">
                  {booking.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Booking ID: {booking.id}</span>
                <span>Balance: ${(parseInt(booking.amount.replace('$', '').replace(',', '')) - parseInt(booking.deposit.replace('$', '').replace(',', ''))).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingBooked;