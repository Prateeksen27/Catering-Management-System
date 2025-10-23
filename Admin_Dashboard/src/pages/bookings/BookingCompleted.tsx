import React, { useEffect } from 'react';
import { CheckCircle2, Star, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingStore } from '../../store/useBookingStore';
import { Rating } from '@mantine/core';

const BookingCompleted: React.FC = () => {
  const { fetchAllCompletedBookings, completedBookings } = useBookingStore()


  useEffect(() => {
    fetchAllCompletedBookings()
  }, [])

  const renderStars = (rating: number) => {
    return <Rating value={rating} fractions={2} readOnly />
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
          <Card key={booking._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    {booking.eventName}
                    {getPaymentBadge(booking.paymentType)}
                  </CardTitle>
                  <p className="text-muted-foreground">Client: {booking.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">100000</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Date</p>
                  <p className="font-medium">{new Date(booking.createdAt).toDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(booking.customerRating)}</div>
                    <span className="text-sm font-medium">({booking.customerRating}/5)</span>
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
                {/* <div className="flex flex-wrap gap-2">
                  {booking.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div> */}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Booking ID: {booking._id}
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