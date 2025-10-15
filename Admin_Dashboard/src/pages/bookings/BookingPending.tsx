import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingStore } from '../../store/useBookingStore';
import { IconCurrencyRupee } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import BookingAssign from '../../components/BookComponent/BookingAssign';

const BookingPending: React.FC = () => {
  const { fetchAllPendingBookings, pendingBookings } = useBookingStore()
  const [opened, { open, close }] = useDisclosure(false); 
  const [details,setDetails] = useState({
    name:"",
    eventName:"",
    phone:0
  })
  const handleBookingAssign = (booking)=>{
    setDetails({
      name:booking.clientDetails.fullName,
      eventName:booking.eventDetails.eventName,
      phone:booking.clientDetails.phone
    })
    open()
  }

  useEffect(() => {
    fetchAllPendingBookings()
  }, [pendingBookings])
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-destructive text-destructive-foreground">High Priority</Badge>;
      case 'Medium':
        return <Badge className="bg-warning text-warning-foreground">Medium Priority</Badge>;
      case 'Low':
        return <Badge variant="secondary">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  return (
    <div className="space-y-6">
      <Modal
        opened={opened}
        onClose={close}
        title={details.eventName + " - " + details.name + " (" + details.phone + ")"}
        fullScreen
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <BookingAssign />
      </Modal>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pending Bookings</h1>
        <p className="text-muted-foreground">Bookings awaiting confirmation or action</p>
      </div>

      <div className="grid gap-6">
        {pendingBookings.map((booking) => (
          <Card key={booking._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    {getPriorityIcon(booking.priority)}
                    {booking.eventDetails.eventName}
                    {getPriorityBadge(booking.priority)}
                  </CardTitle>
                  <p className="text-muted-foreground">Client: {booking.clientDetails.fullName}/Phone:{booking.clientDetails.phone} </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground flex items-center justify-center"><IconCurrencyRupee />{booking.estimatedAmount * (booking.eventDetails.pax + 10)}</p>
                  <p className="text-sm text-muted-foreground">Estimated Value</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Event Date</p>
                  <p className="font-medium">{new Date(booking.eventDetails.eventDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium">{booking.eventDetails.venue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">No Of Guest</p>
                  <p className="font-medium">{booking.eventDetails.pax}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Note From Client</p>
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <p className="text-sm">{booking.eventDetails.notes}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Menu Requested</p>
                <div className="flex flex-wrap gap-2">
                  {Object.values(booking.menu).flat().map((item, index) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))}

                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Booking ID: {booking.bookingId}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                  <Button size="sm" onClick={()=>handleBookingAssign(booking)} >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
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

export default BookingPending;