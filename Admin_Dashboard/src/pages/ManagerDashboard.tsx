import React, { useEffect, useState } from "react";
import {
  Users,
  Package,
  IndianRupee,
  TrendingUp,
  CheckCircle,
  XCircle,
  Play,
  CircleDot,
  Clock,
  Calendar,
  MapPin,
  User,
  Car,
  Utensils
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { useBookingStore } from "@/store/useBookingStore";
import { useChefRequirementStore } from "@/store/useChefRequirementStore";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useTicketStore } from "@/store/useTicketStore";
import toast from "react-hot-toast";
import { Modal, TextInput, Textarea, Select } from "@mantine/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Status badges
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

// Chef Requirements Review Section
const ChefRequirementsReview = () => {
  const { requirements, fetchAllRequirements, updateRequirementStatus, isLoading } = useChefRequirementStore();
  const { employees, fetchAllEmployees } = useEmployeeStore();
  const { createTicket } = useTicketStore();
  
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'High',
    assignedTo: 'none',
    relatedBooking: 'none',
    dueDate: '',
  });

  useEffect(() => {
    fetchAllRequirements({ status: "Submitted" });
  }, []);

  // Fetch workers when modal opens
  useEffect(() => {
    if (modalOpened) {
      fetchAllEmployees().then(() => {
        // Workers will be filtered after employees are loaded
      });
    }
  }, [modalOpened]);

  // Filter workers from employees
  useEffect(() => {
    const workerList = employees.filter((emp: any) => emp.empType === 'Worker');
    setWorkers(workerList);
  }, [employees]);

  const handleApproveClick = (req: any) => {
    setSelectedRequirement(req);
    
    // Get event name from booking
    const eventName = req.bookingId?.eventDetails?.eventName || 'Event';
    const bookingId = req.bookingId?._id || req.bookingId;
    const bookingIdDisplay = req.bookingId?.bookingId || 'N/A';
    const chefName = req.chefId?.name || 'Unknown Chef';
    
    // Format ingredients for description
    const ingredientsList = req.ingredients?.map((ing: any) => ing.ingredientName).join('\n• ') || 'No ingredients listed';
    const notes = req.notes || 'No notes from chef';
    
    // Calculate due date (eventDate - 1 day)
    const eventDate = new Date(req.bookingId?.eventDetails?.eventDate);
    const dueDate = new Date(eventDate);
    dueDate.setDate(dueDate.getDate() - 1);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    
    // Pre-filled title
    const title = `Purchase ingredients for ${eventName}`;
    
    // Pre-filled description
    const description = `Chef ${chefName} has submitted ingredient requirements for this event.\n\nIngredients Required:\n• ${ingredientsList}\n\nNotes from Chef:\n${notes}`;
    
    setFormData({
      title,
      description,
      priority: 'High',
      assignedTo: 'none',
      relatedBooking: bookingId,
      dueDate: dueDateStr,
    });
    
    setModalOpened(true);
  };

  const handleCreateTicket = async () => {
    if (!selectedRequirement) return;
    
    // Validate
    if (formData.assignedTo === 'none') {
      toast.error("Please select a worker");
      return;
    }
    
    if (!formData.dueDate) {
      toast.error("Please select a due date");
      return;
    }
    
    setIsCreatingTicket(true);
    
    try {
      // First, approve the requirement
      await updateRequirementStatus(selectedRequirement._id, "Approved", "Approved by Manager - Ticket created for procurement");
      
      // Then create the ticket
      await createTicket({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        relatedBooking: formData.relatedBooking,
        dueDate: formData.dueDate,
      });
      
      toast.success("Requirement approved and purchase task created!");
      setModalOpened(false);
      fetchAllRequirements({ status: "Submitted" });
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create purchase task");
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateRequirementStatus(id, "Rejected", "Rejected by Manager");
      toast.success("Requirement rejected");
      fetchAllRequirements({ status: "Submitted" });
    } catch (error) {
      toast.error("Failed to reject requirement");
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-yellow-600" />
        <h2 className="text-lg font-semibold">Chef Requirements Awaiting Review</h2>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requirements.length === 0 ? (
        <p className="text-gray-500">No requirements awaiting review</p>
      ) : (
        <div className="space-y-4">
          {requirements.map((req) => (
            <div key={req._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">
                    {req.bookingId?.eventDetails?.eventName || "Event"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Chef: {req.chefId?.name || "Unknown"}
                  </p>
                </div>
                <StatusBadge status={req.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-gray-500">Event Date</p>
                  <p>{req.bookingId?.eventDetails?.eventDate || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Venue</p>
                  <p>{req.bookingId?.eventDetails?.venue || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Guest Count</p>
                  <p>{req.bookingId?.eventDetails?.pax || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estimated Cost</p>
                  <p>₹{req.estimatedCost?.toLocaleString() || 0}</p>
                </div>
              </div>

              {req.ingredients && req.ingredients.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {req.ingredients.slice(0, 5).map((ing, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {ing.ingredientName}
                      </span>
                    ))}
                    {req.ingredients.length > 5 && (
                      <span className="text-xs text-gray-500">
                        +{req.ingredients.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {req.notes && (
                <p className="text-sm text-gray-600 mb-3">Notes: {req.notes}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleApproveClick(req)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(req._id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Purchase Task Modal */}
      <CreatePurchaseTaskModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        formData={formData}
        setFormData={setFormData}
        workers={workers}
        onSubmit={handleCreateTicket}
        isLoading={isCreatingTicket}
        selectedRequirement={selectedRequirement}
      />
    </div>
  );
};

// Create Purchase Task Modal Component
const CreatePurchaseTaskModal = ({ opened, onClose, formData, setFormData, workers, onSubmit, isLoading, selectedRequirement }: any) => {
  const bookingIdDisplay = selectedRequirement?.bookingId?.bookingId || 'N/A';
  const ingredientsList = selectedRequirement?.ingredients?.map((ing: any) => ing.ingredientName).join(', ') || 'No ingredients listed';
  const notes = selectedRequirement?.notes || 'No notes from chef';
  
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create Purchase Task"
      size="lg"
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter ticket title"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter description"
            rows={6}
          />
        </div>

        {/* Priority */}
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            value={formData.priority}
            onChange={(value) => setFormData({ ...formData, priority: value || 'Medium' })}
            data={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Critical', label: 'Critical' },
            ]}
          />
        </div>

        {/* Assigned Worker */}
        <div>
          <Label htmlFor="assignedTo">Assign Worker</Label>
          <Select
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(value) => setFormData({ ...formData, assignedTo: value || 'none' })}
            data={[
              { value: 'none', label: 'Select Worker' },
              ...workers.map((worker: any) => ({
                value: worker._id,
                label: worker.name
              }))
            ]}
          />
        </div>

        {/* Related Booking */}
        <div>
          <Label htmlFor="relatedBooking">Related Booking</Label>
          <Input
            id="relatedBooking"
            value={bookingIdDisplay}
            disabled
          />
        </div>

        {/* Due Date */}
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        {/* Chef Requirements Display */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-2">Chef Requirements</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="mb-2">
              <span className="font-medium text-sm">Ingredients:</span>
              <p className="text-sm text-gray-600">{ingredientsList}</p>
            </div>
            <div>
              <span className="font-medium text-sm">Notes:</span>
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Ticket'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Events Ready For Execution Section
const EventsReadyForExecution = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchBookingsByStatus, updateBookingStatus } = useBookingStore();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const data = await fetchBookingsByStatus("READY_FOR_EVENT");
    setBookings(data);
    setLoading(false);
  };

  const handleStartEvent = async (id: string) => {
    try {
      await updateBookingStatus(id, "IN_PROGRESS", "Event started by Manager");
      toast.success("Event started successfully");
      loadBookings();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to start event");
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold">Events Ready For Execution</h2>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No events ready for execution</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium">
                  {booking.eventDetails?.eventName || "Event"}
                </h3>
                <StatusBadge status="Ready" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{booking.eventDetails?.eventDate || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{booking.eventDetails?.venue || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{booking.eventDetails?.pax || 0} guests</span>
                </div>

                {booking.assignedStaff?.chefs?.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Utensils className="h-4 w-4" />
                    <span>{booking.assignedStaff.chefs.length} Chef(s) assigned</span>
                  </div>
                )}

                {booking.assignedStaff?.workers?.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{booking.assignedStaff.workers.length} Worker(s) assigned</span>
                  </div>
                )}

                {booking.assignedVehicles?.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="h-4 w-4" />
                    <span>{booking.assignedVehicles.length} Vehicle(s) assigned</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleStartEvent(booking._id)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Play className="h-4 w-4" />
                Start Event
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Events In Progress Section
const EventsInProgress = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchBookingsByStatus, updateBookingStatus } = useBookingStore();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const data = await fetchBookingsByStatus("IN_PROGRESS");
    setBookings(data);
    setLoading(false);
  };

  const handleCompleteEvent = async (id: string) => {
    try {
      await updateBookingStatus(id, "COMPLETED", "Event marked as completed by Manager");
      toast.success("Event completed successfully");
      loadBookings();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to complete event");
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <CircleDot className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Events In Progress</h2>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No events in progress</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium">
                  {booking.eventDetails?.eventName || "Event"}
                </h3>
                <StatusBadge status="In Progress" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{booking.eventDetails?.venue || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Started: {new Date().toLocaleDateString()}</span>
                </div>

                {booking.assignedStaff && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                      {(booking.assignedStaff.chefs?.length || 0) + (booking.assignedStaff.workers?.length || 0)} staff deployed
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleCompleteEvent(booking._id)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Event Completed
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Completed Events Section
const CompletedEvents = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchBookingsByStatus } = useBookingStore();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const data = await fetchBookingsByStatus("COMPLETED");
    setBookings(data);
    setLoading(false);
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Completed Events</h2>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No completed events</p>
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 10).map((booking) => (
            <div key={booking._id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <h3 className="font-medium">
                  {booking.eventName || booking.eventDetails?.eventName || "Event"}
                </h3>
                <p className="text-sm text-gray-500">
                  {booking.eventDate || booking.eventDetails?.eventDate} • {booking.venue || booking.eventDetails?.venue}
                </p>
              </div>
              <StatusBadge status="Completed" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ManagerDashboard: React.FC = () => {
  const stats = {
    revenue: "₹4,20,000",
    totalBookings: 124,
    pendingBookings: 26,
    employees: 26
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Manager Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Business performance overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title="Monthly Revenue" value={stats.revenue} icon={<IndianRupee />} />
        <StatsCard title="Total Bookings" value={stats.totalBookings} icon={<Package />} />
        <StatsCard title="Pending Bookings" value={stats.pendingBookings} icon={<TrendingUp />} />
        <StatsCard title="Employees" value={stats.employees} icon={<Users />} />
      </div>

      {/* Chef Requirements Review */}
      <ChefRequirementsReview />

      {/* Events Ready For Execution */}
      <EventsReadyForExecution />

      {/* Events In Progress */}
      <EventsInProgress />

      {/* Completed Events */}
      <CompletedEvents />
    </div>
  );
};

export default ManagerDashboard;
