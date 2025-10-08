import React from 'react';
import { Table2, Users, MapPin, Clock, CheckCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Tables: React.FC = () => {
  const tableReservations = [
    {
      id: 1,
      tableNumber: 'T001',
      capacity: 8,
      location: 'Main Hall',
      customer: 'Wilson Family',
      event: 'Wedding Reception',
      date: '2024-06-20',
      timeSlot: '6:00 PM - 11:00 PM',
      status: 'confirmed',
      specialRequests: 'Near dance floor, vegetarian options',
      guestCount: 8,
      setupStyle: 'Round table with centerpiece'
    },
    {
      id: 2,
      tableNumber: 'T002',
      capacity: 10,
      location: 'Main Hall',
      customer: 'Chen Corporation',
      event: 'Corporate Gala',
      date: '2024-07-15',
      timeSlot: '7:00 PM - 12:00 AM',
      status: 'confirmed',
      specialRequests: 'VIP service, premium linens',
      guestCount: 10,
      setupStyle: 'Executive round table'
    },
    {
      id: 3,
      tableNumber: 'T003',
      capacity: 6,
      location: 'Garden Area',
      customer: 'Martinez Family',
      event: 'Birthday Celebration',
      date: '2024-05-25',
      timeSlot: '7:00 PM - 10:00 PM',
      status: 'pending',
      specialRequests: 'Outdoor seating, birthday cake setup',
      guestCount: 6,
      setupStyle: 'Garden table with umbrella'
    },
    {
      id: 4,
      tableNumber: 'T004',
      capacity: 12,
      location: 'Conference Room',
      customer: 'Thompson Business',
      event: 'Conference Lunch',
      date: '2024-08-10',
      timeSlot: '12:00 PM - 2:00 PM',
      status: 'confirmed',
      specialRequests: 'Business lunch setup, AV equipment nearby',
      guestCount: 12,
      setupStyle: 'Conference style with presentation setup'
    },
    {
      id: 5,
      tableNumber: 'T005',
      capacity: 4,
      location: 'Private Dining',
      customer: 'Anderson Couple',
      event: 'Anniversary Dinner',
      date: '2024-06-05',
      timeSlot: '8:00 PM - 10:30 PM',
      status: 'confirmed',
      specialRequests: 'Intimate lighting, wine pairing',
      guestCount: 2,
      setupStyle: 'Romantic dinner setup'
    },
    {
      id: 6,
      tableNumber: 'T006',
      capacity: 8,
      location: 'Main Hall',
      customer: 'Garcia Family',
      event: 'Graduation Party',
      date: '2024-06-05',
      timeSlot: '5:00 PM - 9:00 PM',
      status: 'waitlisted',
      specialRequests: 'Graduation decorations, photo area nearby',
      guestCount: 8,
      setupStyle: 'Celebration table with photo backdrop'
    }
  ];

  const venues = [
    {
      name: 'Main Hall',
      capacity: 200,
      tables: 25,
      available: 18,
      features: ['Dance Floor', 'Stage', 'Bar Area', 'Kitchen Access']
    },
    {
      name: 'Garden Area',
      capacity: 80,
      tables: 10,
      available: 7,
      features: ['Outdoor Seating', 'Natural Lighting', 'Garden View', 'Weather Cover']
    },
    {
      name: 'Private Dining',
      capacity: 24,
      tables: 6,
      available: 4,
      features: ['Intimate Setting', 'Private Bar', 'Fireplace', 'Wine Storage']
    },
    {
      name: 'Conference Room',
      capacity: 50,
      tables: 8,
      available: 6,
      features: ['AV Equipment', 'Presentation Screen', 'Business Setup', 'WiFi']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-success text-success-foreground">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'waitlisted':
        return <Badge variant="outline">Waitlisted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return <Table2 className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Table Management</h1>
        <p className="text-muted-foreground">Manage table reservations and venue arrangements</p>
      </div>

      {/* Venue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {venues.map((venue, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {venue.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span className="font-medium">{venue.capacity} guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tables Available</span>
                  <span className="font-medium">{venue.available} / {venue.tables}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {venue.features.slice(0, 2).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {venue.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{venue.features.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Table Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tableReservations.map((reservation) => (
              <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-3">
                        {getStatusIcon(reservation.status)}
                        Table {reservation.tableNumber}
                        {getStatusBadge(reservation.status)}
                      </h3>
                      <p className="text-muted-foreground">{reservation.customer} - {reservation.event}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">{reservation.guestCount}</p>
                      <p className="text-sm text-muted-foreground">Guests</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="font-medium">{reservation.date}</p>
                        <p className="text-sm text-muted-foreground">{reservation.timeSlot}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{reservation.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-medium">{reservation.capacity} seats</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Table2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Setup Style</p>
                        <p className="font-medium text-sm">{reservation.setupStyle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">{reservation.specialRequests}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Reservation ID: {reservation.id.toString().padStart(4, '0')}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Layout
                      </Button>
                      <Button size="sm" variant="outline">
                        Modify
                      </Button>
                      {reservation.status === 'pending' && (
                        <Button size="sm">
                          Confirm
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tables;