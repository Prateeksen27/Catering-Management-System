import React, { useEffect, useState } from 'react';
import { Plus, Eye, MoreVertical, Filter, Search, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Modal } from '@mantine/core';
import { useTicketStore } from '../store/useTicketStore';
import { useEmployeeStore } from '../store/useEmployeeStore';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import { ROLES } from '@/constants/roles';

// Priority badge colors
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'Low':
      return <Badge className="bg-gray-500 text-white">Low</Badge>;
    case 'Medium':
      return <Badge className="bg-blue-500 text-white">Medium</Badge>;
    case 'High':
      return <Badge className="bg-orange-500 text-white">High</Badge>;
    case 'Critical':
      return <Badge className="bg-red-600 text-white">Critical</Badge>;
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
};

// Status badge colors
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Open':
      return <Badge className="bg-blue-500 text-white">Open</Badge>;
    case 'In Progress':
      return <Badge className="bg-orange-500 text-white">In Progress</Badge>;
    case 'Review':
      return <Badge className="bg-purple-500 text-white">Review</Badge>;
    case 'Completed':
      return <Badge className="bg-green-500 text-white">Completed</Badge>;
    case 'Closed':
      return <Badge className="bg-gray-500 text-white">Closed</Badge>;
    case 'Rejected':
      return <Badge className="bg-red-500 text-white">Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const AssignWork: React.FC = () => {
  const { user } = useAuthStore();
  const { tickets, fetchAllTickets, createTicket, isLoading } = useTicketStore();
  const { employees, fetchAllEmployees } = useEmployeeStore();
  const { booked, fetchAllBookedEvents } = useBookingStore();

  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: 'none',
    relatedBooking: 'none',
    dueDate: '',
  });

  // Check if user is Admin or Manager
  const isAdminOrManager = user?.empType === ROLES.Admin || user?.empType === ROLES.Manager;

  useEffect(() => {
    if (isAdminOrManager) {
      fetchAllTickets();
      fetchAllEmployees();
      fetchAllBookedEvents();
    }
  }, [isAdminOrManager]);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(query) ||
        ticket.ticketId.toLowerCase().includes(query) ||
        ticket.assignedTo?.name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCreateTicket = async () => {
    try {
      await createTicket({
        ...formData,
        relatedBooking: formData.relatedBooking || null,
      });
      setCreateModalOpened(false);
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        assignedTo: 'none',
        relatedBooking: 'none',
        dueDate: '',
      });
      fetchAllTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setViewModalOpened(true);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if due date is overdue
  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'Completed' || status === 'Closed') return false;
    return new Date(dueDate) < new Date();
  };

  if (!isAdminOrManager) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assign Work</h1>
          <p className="text-muted-foreground">Create and manage work tickets</p>
        </div>
        <Button onClick={() => setCreateModalOpened(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Ticket
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Related Event</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell className="font-medium">{ticket.ticketId}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{ticket.title}</TableCell>
                    <TableCell>{ticket.assignedTo?.name || 'N/A'}</TableCell>
                    <TableCell>{ticket.relatedBooking?.bookingId || '-'}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ticket.status)}
                        {isOverdue(ticket.dueDate, ticket.status) && (
                          <Badge className="bg-red-600 text-white">Overdue</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(ticket.dueDate)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Ticket Modal */}
      <Modal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        title="Create New Ticket"
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title *</label>
            <Input
              placeholder="Enter ticket title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description *</label>
            <Textarea
              placeholder="Enter ticket description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Due Date *</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Assign To *</label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select Employee</SelectItem>
                {employees
                  .filter((emp) => emp.status !== 'On-leave')
                  .map((emp) => (
                    <SelectItem key={emp._id} value={String(emp._id)}>
                      {emp.name} ({emp.empType})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Related Event (Optional)</label>
            <Select
              value={formData.relatedBooking}
              onValueChange={(value) => setFormData({ ...formData, relatedBooking: value === 'none' ? '' : value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {booked.map((booking) => (
                  <SelectItem key={booking._id} value={String(booking._id)}>
                    {booking.bookingId} - {booking.eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setCreateModalOpened(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTicket}
              disabled={
                !formData.title ||
                !formData.description ||
                !formData.assignedTo ||
                !formData.dueDate ||
                isLoading
              }
            >
              {isLoading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Ticket Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title={`Ticket ${selectedTicket?.ticketId || ''}`}
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {selectedTicket && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <p className="mt-1 font-medium">{selectedTicket.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1">{selectedTicket.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                <p className="mt-1">{selectedTicket.assignedTo?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created By</label>
                <p className="mt-1">{selectedTicket.createdBy?.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                <p className="mt-1">{formatDate(selectedTicket.dueDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Related Event</label>
                <p className="mt-1">
                  {selectedTicket.relatedBooking
                    ? `${selectedTicket.relatedBooking.bookingId} - ${selectedTicket.relatedBooking.eventName}`
                    : 'None'}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Activity Log</label>
              <div className="mt-2 max-h-[200px] overflow-y-auto space-y-2">
                {selectedTicket.activityLog?.length > 0 ? (
                  selectedTicket.activityLog.map((log: any, index: number) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-muted-foreground"> - {formatDate(log.timestamp)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No activity yet</p>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setViewModalOpened(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AssignWork;
