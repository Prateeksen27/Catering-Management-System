import React, { useEffect, useState, useMemo } from "react";
import { Eye, Phone, Mail, Calendar, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookingStore } from "../../store/useBookingStore";

const BookingInquire = () => {
  const { queries, isLoading, fetchAllQueries } = useBookingStore();

  // ✅ Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  useEffect(() => {
    fetchAllQueries();
  }, [fetchAllQueries]);

  // ✅ Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('date-desc');
  };

  // ✅ Filter and sort inquiries
  const filteredQueries = useMemo(() => {
    let result = [...(queries || [])];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (inquiry) =>
          inquiry.clientName?.toLowerCase().includes(query) ||
          inquiry.eventName?.toLowerCase().includes(query) ||
          inquiry.phone?.toLowerCase().includes(query) ||
          inquiry.email?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(
        (inquiry) => inquiry.status?.toLowerCase() === statusFilter
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'budget-asc':
          return (a.budget || 0) - (b.budget || 0);
        case 'budget-desc':
          return (b.budget || 0) - (a.budget || 0);
        case 'guests-asc':
          return (a.pax || 0) - (b.pax || 0);
        case 'guests-desc':
          return (b.pax || 0) - (a.pax || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [queries, searchQuery, statusFilter, sortBy]);

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

      {/* ✅ Search and Filter Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-muted/30 p-4 rounded-lg">
        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, event, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
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
              <SelectItem value="budget-desc">Highest Budget</SelectItem>
              <SelectItem value="budget-asc">Lowest Budget</SelectItem>
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
        Showing {filteredQueries.length} of {queries?.length || 0} inquiries
      </p>

      {/* Query List */}
      <div className="grid gap-6">
        {filteredQueries.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No inquiries found
          </p>
        ) : (
          filteredQueries.map((inquiry) => (
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
