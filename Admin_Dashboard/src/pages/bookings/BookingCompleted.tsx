import React from 'react';
import { CheckCircle2, Star, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BookingCompleted: React.FC = () => {
  const completedBookings = [
    {
      id: 'CM001',
      customerName: 'Jennifer Adams',
      event: 'Wedding Reception',
      date: '2024-04-15',
      amount: '$8,500',
      rating: 5,
      feedback: 'Absolutely fantastic service! Everything was perfect from start to finish.',
      services: ['Photography', 'Catering', 'Decoration', 'Music'],
      paymentStatus: 'paid'
    },
    {
      id: 'CM002',
      customerName: 'Mark Johnson',
      event: 'Corporate Conference',
      date: '2024-04-10',
      amount: '$12,000',
      rating: 4,
      feedback: 'Professional service, minor delays in setup but overall excellent execution.',
      services: ['Full Event Management', 'Catering', 'AV Equipment'],
      paymentStatus: 'paid'
    },
    {
      id: 'CM003',
      customerName: 'Rachel Green',
      event: 'Birthday Party',
      date: '2024-04-05',
      amount: '$2,300',
      rating: 5,
      feedback: 'Amazing experience! The decoration was beyond our expectations.',
      services: ['Decoration', 'Catering', 'Entertainment'],
      paymentStatus: 'paid'
    },
    {
      id: 'CM004',
      customerName: 'Thomas Brown',
      event: 'Retirement Celebration',
      date: '2024-03-28',
      amount: '$3,800',
      rating: 4,
      feedback: 'Good service overall. Food quality was excellent, venue setup was professional.',
      services: ['Catering', 'Venue Setup', 'Photography'],
      paymentStatus: 'partial'
    },
    {
      id: 'CM005',
      customerName: 'Amy Chen',
      event: 'Product Launch',
      date: '2024-03-20',
      amount: '$9,200',
      rating: 5,
      feedback: 'Outstanding event management. Every detail was handled perfectly!',
      services: ['Full Event Management', 'Catering', 'AV Setup', 'Marketing Support'],
      paymentStatus: 'paid'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success text-success-foreground">Fully Paid</Badge>;
      case 'partial':
        return <Badge className="bg-warning text-warning-foreground">Partial Payment</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Completed Bookings</h1>
        <p className="text-muted-foreground">Successfully completed events and customer feedback</p>
      </div>

      <div className="grid gap-6">
        {completedBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    {booking.event}
                    {getPaymentBadge(booking.paymentStatus)}
                  </CardTitle>
                  <p className="text-muted-foreground">Client: {booking.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{booking.amount}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Date</p>
                  <p className="font-medium">{booking.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(booking.rating)}</div>
                    <span className="text-sm font-medium">({booking.rating}/5)</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Customer Feedback</p>
                <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                  <p className="text-sm italic">"{booking.feedback}"</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Services Delivered</p>
                <div className="flex flex-wrap gap-2">
                  {booking.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Booking ID: {booking.id}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
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
    </div>
  );
};

export default BookingCompleted;