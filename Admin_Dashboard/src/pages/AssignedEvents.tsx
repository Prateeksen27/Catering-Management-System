"use client";
import React, { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Edit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCurrencyRupee } from "@tabler/icons-react";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AssignedEvents: React.FC = () => {
  const { assignedEvents = [], fetchAllAssignedEvents } = useEmployeeStore();
  const { user } = useAuthStore();

  const [selectedStaff, setSelectedStaff] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    bookingStatus: "",
    deposited: "",
  });

  useEffect(() => {
    if (user?._id) {
      fetchAllAssignedEvents(user._id);
    }
  }, [user?._id, fetchAllAssignedEvents]);

  const stats = {
    total: assignedEvents.length,
    inProgress: assignedEvents.filter(
      (e) => e.bookingStatus?.toLowerCase() === "in-progress"
    ).length,
    completed: assignedEvents.filter(
      (e) => e.bookingStatus?.toLowerCase() === "completed"
    ).length,
    overdue: assignedEvents.filter(
      (e) => e.bookingStatus?.toLowerCase() === "overdue"
    ).length,
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      case "overdue":
        return <Badge className="bg-red-500 text-white">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status || "N/A"}</Badge>;
    }
  };

  const getPaymentBadge = (amount = 0, deposited = 0) => {
    if (deposited <= 0)
      return <Badge variant="destructive">Unpaid</Badge>;
    else if (deposited < amount)
      return <Badge variant="outline">Partially Paid</Badge>;
    else if (deposited >= amount)
      return <Badge variant="secondary">Paid</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  // 🔹 Handle View Assigned Staff Click
  const handleShowStaff = (staffList: any[]) => {
    setSelectedStaff(staffList || []);
    setIsDialogOpen(true);
  };

  // 🔹 Handle Update Status Click
  const handleUpdateStatus = (event: any) => {
    setSelectedEvent(event);
    setFormData({
      bookingStatus: event.bookingStatus || "",
      deposited: event.deposited?.toString() || "",
    });
    setIsStatusDialogOpen(true);
  };

  // 🔹 Handle Form Input Change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 🔹 Handle Status Update Submission
  const handleStatusUpdate = async () => {
    if (!selectedEvent || !formData.bookingStatus) return;

    // Add your update logic here
    console.log("Updating event:", selectedEvent._id, "with data:", {
      bookingStatus: formData.bookingStatus,
      deposited: parseFloat(formData.deposited) || 0,
    });
    
    // Close dialog after update
    setIsStatusDialogOpen(false);
    setSelectedEvent(null);
    setFormData({
      bookingStatus: "",
      deposited: "",
    });
  };

  // Calculate due amount
  const calculateDueAmount = () => {
    if (!selectedEvent) return 0;
    const totalAmount = selectedEvent.totalAmount || 0;
    const deposited = parseFloat(formData.deposited) || 0;
    return Math.max(totalAmount - deposited, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assigned Events</h1>
        <p className="text-muted-foreground">
          View and manage all events assigned to you efficiently
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Tasks",
            value: stats.total,
            icon: FileText,
            color: "text-primary bg-primary/10",
          },
          {
            label: "In Progress",
            value: stats.inProgress,
            icon: Clock,
            color: "text-yellow-500 bg-yellow-100",
          },
          {
            label: "Overdue",
            value: stats.overdue,
            icon: AlertCircle,
            color: "text-red-500 bg-red-100",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "text-green-500 bg-green-100",
          },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event List */}
      <div className="grid gap-6">
        {assignedEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No events assigned yet.
          </p>
        ) : (
          assignedEvents.map((task: any) => (
            <Card key={task._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <CardTitle className="flex items-center gap-3 flex-wrap">
                    {getStatusIcon(task.bookingStatus)}
                    <span>{task.eventName}</span>
                    {getStatusBadge(task.bookingStatus)}
                    {getPaymentBadge(task.totalAmount, task.deposited)}
                  </CardTitle>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-foreground flex items-center justify-end">
                      <IconCurrencyRupee size={16} />
                      {task.totalAmount ?? 0}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Client Name
                      </p>
                      <p className="font-medium">{task.clientName ?? "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Event Date</p>
                      <p className="font-medium">
                        {task.eventDate
                          ? new Date(task.eventDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <Badge variant="outline">{task.venue || "N/A"}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Due Payment</p>
                    <p className="font-medium">
                      {(task.totalAmount ?? 0) - (task.deposited ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground flex-wrap gap-2">
                  <span>Assigned by: Admin</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShowStaff(task.assignedStaff)}
                    >
                      View Assigned Staffs
                    </Button>
                    {task.status !== "completed" && (
                      <Button 
                        size="sm"
                        onClick={() => handleUpdateStatus(task)}
                      >
                        Update Status
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 🔹 Staff Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assigned Staff</DialogTitle>
          </DialogHeader>

          <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
            {selectedStaff?.length === 0 ? (
              <p className="text-sm text-center text-muted-foreground py-4">
                No staff assigned for this event.
              </p>
            ) : (
              selectedStaff.map((staff: any) => (
                <div
                  key={staff._id}
                  className="flex items-center gap-3 border p-2 rounded-lg hover:bg-muted transition"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={staff.profilePic} alt={staff.name} />
                    <AvatarFallback>{staff.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{staff.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {staff.role || "Staff"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 🔹 Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Event Status</DialogTitle>
            <DialogDescription>
              Update booking status and payment details for {selectedEvent?.eventName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Booking Status */}
            <div className="space-y-2">
              <Label htmlFor="bookingStatus">Booking Status</Label>
              <Select
                value={formData.bookingStatus}
                onValueChange={(value) => handleInputChange("bookingStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Deposited Amount */}
            <div className="space-y-2">
              <Label htmlFor="deposited">Deposited Amount (₹)</Label>
              <Input
                id="deposited"
                type="number"
                placeholder="Enter deposited amount"
                value={formData.deposited}
                onChange={(e) => handleInputChange("deposited", e.target.value)}
              />
              {selectedEvent && (
                <p className="text-xs text-muted-foreground">
                  Total Amount: ₹{selectedEvent.totalAmount || 0} | 
                  Due: ₹{calculateDueAmount()}
                </p>
              )}
            </div>

            {/* Current Status Display */}
            {selectedEvent && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Current Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(selectedEvent.bookingStatus)}
                  {getStatusBadge(selectedEvent.bookingStatus)}
                  <span className="text-sm">
                    Deposited: ₹{selectedEvent.deposited || 0}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={!formData.bookingStatus}
            >
              Update Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignedEvents;