import React, { useEffect, useState } from 'react';
import { Eye, MessageSquare, Paperclip, Clock, CheckCircle, PlayCircle, Search, AlertCircle } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Modal } from '@mantine/core';
import { useTicketStore } from '../store/useTicketStore';
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

// Get available status transitions based on current status
const getAvailableTransitions = (currentStatus: string) => {
  switch (currentStatus) {
    case 'Open':
      return ['In Progress'];
    case 'In Progress':
      return ['Review'];
    case 'Review':
      return ['Completed', 'Rejected'];
    case 'Rejected':
      return ['In Progress'];
    case 'Completed':
    case 'Closed':
      return [];
    default:
      return [];
  }
};

const AssignedWork: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    myTickets, 
    myTaskCounts, 
    fetchMyTasks, 
    updateTicketStatus, 
    addComment, 
    selectedTicket,
    fetchTicketById,
    clearSelectedTicket,
    isLoading 
  } = useTicketStore();

  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedTicketLocal, setSelectedTicketLocal] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Check if user is Admin - Admin should not access My Tasks page
  const isAdmin = user?.empType === ROLES.Admin;

  useEffect(() => {
    if (user?._id && !isAdmin) {
      fetchMyTasks();
    }
  }, [user?._id, isAdmin]);

  // Redirect or show access denied if Admin
  if (isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Admins do not have access to this page. Please use the Assign Work page to manage tickets.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter tickets
  const filteredTickets = myTickets.filter((ticket) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(query) ||
        ticket.ticketId.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleViewTicket = async (ticket: any) => {
    await fetchTicketById(ticket._id);
    setSelectedTicketLocal(ticket);
    setViewModalOpened(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (selectedTicket) {
      await updateTicketStatus(selectedTicket._id, newStatus);
      setNewComment('');
    }
  };

  const handleAddComment = async () => {
    if (selectedTicket && newComment.trim()) {
      await addComment(selectedTicket._id, newComment);
      setNewComment('');
    }
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

  const isTicketLocked = selectedTicket?.status === 'Closed' || selectedTicket?.status === 'Completed';
  const availableTransitions = selectedTicket ? getAvailableTransitions(selectedTicket.status) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground">View and manage your assigned work</p>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Open</p>
                <p className="text-3xl font-bold text-blue-700">{myTaskCounts.Open || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">In Progress</p>
                <p className="text-3xl font-bold text-orange-700">{myTaskCounts['In Progress'] || 0}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <PlayCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Review</p>
                <p className="text-3xl font-bold text-purple-700">{myTaskCounts.Review || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-700">{myTaskCounts.Completed || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search your tasks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No tasks assigned to you
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell className="font-medium">{ticket.ticketId}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{ticket.title}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {formatDate(ticket.dueDate)}
                        {isOverdue(ticket.dueDate, ticket.status) && (
                          <Badge className="bg-red-600 text-white">Overdue</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
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

      {/* View Task Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => {
          setViewModalOpened(false);
          clearSelectedTicket();
          setSelectedTicketLocal(null);
        }}
        title={`Task ${selectedTicket?.ticketId || selectedTicketLocal?.ticketId || ''}`}
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {(selectedTicket || selectedTicketLocal) && (
          <div className="space-y-4">
            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">{getStatusBadge((selectedTicket || selectedTicketLocal)?.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <div className="mt-1">{getPriorityBadge((selectedTicket || selectedTicketLocal)?.priority)}</div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <p className="mt-1 font-medium">{(selectedTicket || selectedTicketLocal)?.title}</p>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1">{(selectedTicket || selectedTicketLocal)?.description}</p>
            </div>

            {/* Due Date and Related Event */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                <p className="mt-1">
                  {formatDate((selectedTicket || selectedTicketLocal)?.dueDate)}
                  {isOverdue((selectedTicket || selectedTicketLocal)?.dueDate, (selectedTicket || selectedTicketLocal)?.status) && (
                    <Badge className="ml-2 bg-red-600 text-white">Overdue</Badge>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Related Event</label>
                <p className="mt-1">
                  {(selectedTicket || selectedTicketLocal)?.relatedBooking
                    ? `${(selectedTicket || selectedTicketLocal)?.relatedBooking?.bookingId} - ${(selectedTicket || selectedTicketLocal)?.relatedBooking?.eventName}`
                    : 'None'}
                </p>
              </div>
            </div>

            {/* Created By */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created By</label>
              <p className="mt-1">{(selectedTicket || selectedTicketLocal)?.createdBy?.name}</p>
            </div>

            {/* Status Update (if not locked) */}
            {!isTicketLocked && availableTransitions.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Update Status</label>
                <div className="flex gap-2 mt-1">
                  <Select onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTransitions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Add Comment */}
            {!isTicketLocked && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Add Comment</label>
                <div className="flex gap-2 mt-1">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button 
                    onClick={handleAddComment} 
                    disabled={!newComment.trim() || isLoading}
                    className="self-end"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            )}

            {/* Activity Log */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Activity Log</label>
              <div className="mt-2 max-h-[200px] overflow-y-auto space-y-2">
                {(selectedTicket || selectedTicketLocal)?.activityLog?.length > 0 ? (
                  (selectedTicket || selectedTicketLocal)?.activityLog?.map((log: any, index: number) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                      <span className="font-medium">{log.action}</span>
                      {log.newValue && <span className="text-muted-foreground"> - {log.newValue}</span>}
                      <span className="text-muted-foreground ml-2">- {formatDate(log.timestamp)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No activity yet</p>
                )}
              </div>
            </div>

            {/* Attachments */}
            {(selectedTicket || selectedTicketLocal)?.attachments?.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Attachments</label>
                <div className="mt-2 space-y-2">
                  {(selectedTicket || selectedTicketLocal)?.attachments?.map((attachment: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                      <Paperclip className="w-4 h-4" />
                      <a 
                        href={attachment.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {attachment.fileName}
                      </a>
                      <span className="text-muted-foreground">
                        - {formatDate(attachment.uploadedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Message */}
            {isTicketLocked && (
              <div className="p-3 bg-gray-100 rounded text-center text-muted-foreground">
                This ticket is {selectedTicket?.status.toLowerCase()} and cannot be modified.
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button onClick={() => {
                setViewModalOpened(false);
                clearSelectedTicket();
                setSelectedTicketLocal(null);
              }}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AssignedWork;
