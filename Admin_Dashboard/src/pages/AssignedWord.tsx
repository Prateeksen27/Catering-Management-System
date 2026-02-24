import React, { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Plus,
  Loader2
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mantine imports
import { Modal, Select as MantineSelect } from '@mantine/core';
import { useTaskStore } from '@/store/useTaskStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useAuthStore } from '@/store/useAuthStore';

const AssignedWord: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks, events, isLoading, fetchTasks, fetchEvents, createTask, updateTaskStatus } = useTaskStore();
  const { employees, fetchAllEmployees } = useEmployeeStore();

  const isAdminOrManager = user?.empType === 'ADMIN' || user?.empType === 'MANAGER';

  // Selected task
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const selectedTask = tasks.find(task => task._id === selectedTaskId);

  // Modal states
  const [opened, setOpened] = useState(false);
  const [createModalOpened, setCreateModalOpened] = useState(false);
  
  // Form states
  const [status, setStatus] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: '',
    eventRef: ''
  });

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
    if (isAdminOrManager) {
      fetchEvents();
      fetchAllEmployees();
    }
  }, [isAdminOrManager]);

  // Set initial selected task
  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(tasks[0]._id);
    }
  }, [tasks]);

  // Sync selected task to modal fields
  useEffect(() => {
    if (selectedTask) {
      setStatus(selectedTask.status);
    }
  }, [selectedTask]);

  const handleUpdateStatus = async () => {
    if (selectedTaskId && status) {
      await updateTaskStatus(selectedTaskId, status);
      setOpened(false);
      fetchTasks(); // Refresh to get updated data
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      return;
    }

    const taskData = {
      ...newTask,
      assignedTo: newTask.assignedTo,
      eventRef: newTask.eventRef || null
    };

    const result = await createTask(taskData);
    if (result) {
      setCreateModalOpened(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignedTo: '',
        eventRef: ''
      });
      fetchTasks();
    }
  };

  // Stats calculation
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date()).length
  };

  const getStatusBadge = (taskStatus: string) => {
    switch (taskStatus) {
      case 'Completed':
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{taskStatus}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'Medium':
        return <Badge variant="outline">Medium</Badge>;
      case 'Low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusIcon = (taskStatus: string) => {
    switch (taskStatus) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Pending':
        return <FileText className="h-5 w-5 text-yellow-500" />;
      case 'Cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const employeeOptions = employees.map(emp => ({
    value: emp._id,
    label: `${emp.name} (${emp.empType})`
  }));

  const eventOptions = events.map(event => ({
    value: event._id,
    label: `${event.eventName} - ${formatDate(event.eventDate)}`
  }));

  // Status options based on role
  const statusOptions = isAdminOrManager
    ? [
        { value: 'Pending', label: 'Pending' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' }
      ]
    : [
        { value: 'Pending', label: 'Pending' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' }
      ];

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Assigned Work</h1>
          <p className="text-muted-foreground">
            Track and manage assigned tasks
          </p>
        </div>

        {isAdminOrManager && (
          <Button onClick={() => setCreateModalOpened(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        )}
      </div>

      {/* No tasks message */}
      {tasks.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tasks assigned yet</p>
          </CardContent>
        </Card>
      )}

      {tasks.length > 0 && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.inProgress}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.overdue}</p>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Selector */}
          <div className="flex gap-3 items-center">
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a task" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map(task => (
                  <SelectItem key={task._id} value={task._id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={() => setOpened(true)}>Update Status</Button>
          </div>

          {/* Task Details Card */}
          {selectedTask && (
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center flex-wrap">
                  {getStatusIcon(selectedTask.status)}
                  <span className="flex-1">{selectedTask.title}</span>
                  {getStatusBadge(selectedTask.status)}
                  {getPriorityBadge(selectedTask.priority)}
                </CardTitle>
                <p className="text-muted-foreground">{selectedTask.description}</p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex gap-2 items-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned To</p>
                      <p className="text-sm font-medium">
                        {selectedTask.assignedTo?.name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="text-sm font-medium">{formatDate(selectedTask.dueDate)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned By</p>
                      <p className="text-sm font-medium">
                        {selectedTask.assignedBy?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {selectedTask.eventRef && (
                    <div className="flex gap-2 items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Event</p>
                        <p className="text-sm font-medium">
                          {selectedTask.eventRef.eventName || 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ===== UPDATE STATUS MODAL ===== */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Update Task Status" centered>
        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* ===== CREATE TASK MODAL (Admin/Manager only) ===== */}
      <Modal 
        opened={createModalOpened} 
        onClose={() => setCreateModalOpened(false)} 
        title="Create New Task" 
        centered
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <Label>Task Title *</Label>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Assign To *</Label>
            <Select
              value={newTask.assignedTo}
              onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employeeOptions.map(emp => (
                  <SelectItem key={emp.value} value={emp.value}>
                    {emp.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {eventOptions.length > 0 && (
            <div>
              <Label>Related Event (Optional)</Label>
              <Select
                value={newTask.eventRef}
                onValueChange={(value) => setNewTask({ ...newTask, eventRef: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {eventOptions.map(event => (
                    <SelectItem key={event.value} value={event.value}>
                      {event.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setCreateModalOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssignedWord;
