import React, { useEffect } from "react";
import { Eye, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "../../store/useBookingStore";

const BookingInquire = () => {
  const { queries, isLoading, fetchAllQueries } = useBookingStore();

  useEffect(() => {
    fetchAllQueries();
  }, [fetchAllQueries]);

  const getStatusBadge = (status) => {
    const variants = {
      new: "default",
      contacted: "secondary",
      reviewing: "outline",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "New"}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        Loading queries...
      </p>
    );
  }

  return (
    <div className="space-y-6 px-3 md:px-6 lg:px-10">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Inquiry Management
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Review and respond to new booking inquiries
        </p>
      </div>

      {/* Query List */}
      <div className="grid gap-6">
        {queries.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No inquiries found
          </p>
        ) : (
          queries.map((inquiry) => (
            <Card
              key={inquiry._id}
              className="hover:shadow-md transition-shadow rounded-2xl"
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Client Info */}
                  <div className="flex flex-col">
                    <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
                      {inquiry.clientName}
                      {getStatusBadge(inquiry.status)}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm md:text-base">
                      {inquiry.eventName}
                    </p>
                  </div>

                </div>
              </CardHeader>

              <CardContent>
                {/* Grid Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium break-words">{inquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{inquiry.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Event Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {inquiry.eventDate
                        ? new Date(inquiry.eventDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">₹{inquiry.budget}</p>
                  </div>
                </div>

                {/* Message Section */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <p className="text-sm bg-muted p-3 rounded-lg break-words">
                    {inquiry.message}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>{inquiry.pax} guests</span>
                  <span>
                    Submitted on:{" "}
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingInquire;
