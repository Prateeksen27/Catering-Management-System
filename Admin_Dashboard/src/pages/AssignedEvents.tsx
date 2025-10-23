import React, { useEffect } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCurrencyRupee } from "@tabler/icons-react";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useAuthStore } from "../store/useAuthStore";

const AssignedEvents: React.FC = () => {
  const { assignedEvents = [], fetchAllAssignedEvents } = useEmployeeStore();
  const { user } = useAuthStore();

  // ✅ Fetch assigned events when user is ready
  useEffect(() => {
    if (user?._id) {
      fetchAllAssignedEvents(user._id);
    }
  }, [user?._id, fetchAllAssignedEvents]);

  // ✅ Calculate dynamic stats
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

  // ✅ Status badge
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

  // ✅ Fixed payment badge logic
  const getPaymentBadge = (amount = 0, deposited = 0) => {
    if (deposited <= 0)
      return <Badge variant="destructive">Unpaid</Badge>;
    else if (deposited < amount)
      return <Badge variant="outline">Partially Paid</Badge>;
    else if (deposited >= amount)
      return <Badge variant="secondary">Paid</Badge>;
  };

  // ✅ Status icon
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assigned Events</h1>
        <p className="text-muted-foreground">
          View and manage all events assigned to you efficiently
        </p>
      </div>

      {/* Stats Overview */}
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

      {/* Task List */}
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
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
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
                      <p className="text-sm text-muted-foreground">
                        Event Date
                      </p>
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
                    <p className="text-sm text-muted-foreground">
                      Due Payment
                    </p>
                    <p className="font-medium">
                      {(task.totalAmount ?? 0) - (task.deposited ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground flex-wrap gap-2">
                  <span>Assigned by: Admin</span>
                  <span>Booking ID: #{task.bookingId}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedEvents;
