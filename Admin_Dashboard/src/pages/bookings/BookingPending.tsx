import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle, CheckCircle, X, MapPin, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingStore } from '../../store/useBookingStore';
import { IconCurrencyRupee } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Textarea } from '@mantine/core';
import BookingAssign from '../../components/BookComponent/BookingAssign';

const BookingPending: React.FC = () => {
  const { fetchAllPendingBookings, pendingBookings, rejectBooking, approveBooking } = useBookingStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [rejectModalOpened, { open: openRejectModal, close: closeRejectModal }] = useDisclosure(false);
  const [mapOpened, setMapOpened] = useState(false);
  const [mapLocation, setMapLocation] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [details, setDetails] = useState({
    _id: '',
    name: '',
    eventName: '',
    phone: 0,
    eventDate: '',
    eventTime: '',
    venue: '',
    pax: 0,
    totalAmount: 0,
    menu: [],
  });

  // Handle Approve → Open booking assign modal
  const handleBookingAssign = (booking: any) => {
    setDetails({
      _id: booking._id,
      name: booking.clientDetails.fullName,
      eventName: booking.eventDetails.eventName,
      phone: booking.clientDetails.phone,
      eventDate: booking.eventDetails.eventDate,
      eventTime: booking.eventDetails.eventTime,
      venue: booking.eventDetails.venue,
      pax: booking.eventDetails.pax,
      totalAmount: booking.Payment_Details?.estimatedAmount * (booking.eventDetails.pax + 10),
      menu: booking.menu,
    });
    open();
  };

  // Handle Reject → Open reject modal
  const handleRejectClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setRejectReason('');
    openRejectModal();
  };

  // Confirm Reject
  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    try {
      await rejectBooking(selectedBookingId, rejectReason);
      closeRejectModal();
      fetchAllPendingBookings();
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  // Handle Map Modal
  const handleOpenMap = (venue: string) => {
    setMapLocation(venue);
    setMapOpened(true);
  };

  useEffect(() => {
    fetchAllPendingBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING_REVIEW: "bg-yellow-600",
      CONFIRMED: "bg-blue-600",
      PREPARATION_PENDING: "bg-purple-600",
      REQUIREMENT_SUBMITTED: "bg-indigo-600",
      READY_FOR_EVENT: "bg-teal-600",
      IN_PROGRESS: "bg-orange-600",
      COMPLETED: "bg-green-600",
      REJECTED: "bg-red-600"
    };

    return (
      <Badge className={statusColors[status] || "bg-gray-600"}>
        {status?.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            High Priority
          </Badge>
        );
      case 'Medium':
        return (
          <Badge className="bg-warning text-warning-foreground">
            Medium Priority
          </Badge>
        );
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
      {/* Booking Assign Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          details.eventName +
          ' - ' +
          details.name +
          ' (' +
          details.phone +
          ')'
        }
        size="70%"
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <BookingAssign onCloseDrawer={close} eventData={details} />
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        opened={rejectModalOpened}
        onClose={closeRejectModal}
        title="Reject Booking"
        radius="md"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Please provide a reason for rejecting this booking. This will be sent to the client.
          </p>
          <Textarea
            label="Rejection Reason"
            placeholder="Enter reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeRejectModal}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject}>
              <Ban className="h-4 w-4 mr-2" />
              Reject Booking
            </Button>
          </div>
        </div>
      </Modal>

      {/* Map Modal */}
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
        <h1 className="text-3xl font-bold text-foreground">Booked Events</h1>
        <p className="text-muted-foreground">
          Bookings awaiting confirmation or action
        </p>
      </div>

      <div className="grid gap-6">
        {pendingBookings.map((booking: any) => (
          <Card key={booking._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    {getPriorityIcon(booking.priority)}
                    {booking.eventDetails.eventName}
                    {getPriorityBadge(booking.priority)}
                    {getStatusBadge(booking.status)}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Client: {booking.clientDetails.fullName} / Phone:{' '}
                    {booking.clientDetails.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground flex items-center justify-center">
                    <IconCurrencyRupee />
                    {booking.Payment_Details?.estimatedAmount * (booking.eventDetails.pax + 10)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estimated Value
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Event Date</p>
                  <p className="font-medium">
                    {new Date(
                      booking.eventDetails.eventDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                {/* venue + Map Button */}
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium flex items-center gap-2">
                    {booking.eventDetails.venue}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenMap(booking.eventDetails.venue)}
                      className="flex items-center gap-1"
                    >
                      <MapPin className="h-4 w-4" />
                      View on Map
                    </Button>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">No Of Guest</p>
                  <p className="font-medium">{booking.eventDetails.pax}</p>
                </div>

                {/* Show status info */}
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <div className="text-xs text-muted-foreground">
                    {booking.timeline?.slice(-2).map((entry: any, i: number) => (
                      <p key={i}>{entry.action} - {new Date(entry.timestamp).toLocaleDateString()}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Note From Client
                </p>
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <p className="text-sm">{booking.eventDetails.notes || "No notes"}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Menu Requested
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.values(booking.menu || {})
                    .flat()
                    .map((item: any, index: number) => (
                      <Badge key={index} variant="outline">
                        {String(item)}
                      </Badge>
                    ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Payment Details
                </p>

                <div className="bg-muted/30 border rounded-lg p-3 space-y-1 text-sm">

                  <p className="flex items-center gap-1">
                    Estimated Amount:
                    <IconCurrencyRupee className="h-4 w-4" />
                    {booking?.Payment_Details?.estimatedAmount || 0}
                  </p>

                  <p className="flex items-center gap-1">
                    Paid Amount:
                    <IconCurrencyRupee className="h-4 w-4" />
                    {booking?.Payment_Details?.paidAmount || "Not Paid Yet"}
                  </p>

                  <p>
                    Payment Method: {booking?.Payment_Details?.paymentMethods || "Other"}
                  </p>

                  <p>
                    Transaction ID: {booking?.Payment_Details?.transactionId || "Not Provided"}
                  </p>

                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Booking ID: {booking.bookingId}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectClick(booking._id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBookingAssign(booking)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Assign
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
