import React, { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ✅ Mantine imports
import { Modal, Select, NumberInput } from '@mantine/core';

const AssignedWord: React.FC = () => {
  // ✅ tasks as STATE
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Create Wedding Photography Contract',
      description: 'Draft comprehensive photography service agreement for Wilson wedding',
      assignedTo: 'Sarah Johnson',
      assignedBy: 'Manager',
      dueDate: '2024-06-15',
      priority: 'high',
      status: 'in-progress',
      category: 'Legal Documents',
      estimatedHours: 4,
      completedHours: 2,
      client: 'Alice Wilson'
    },
    {
      id: 2,
      title: 'Update Catering Menu Descriptions',
      description: 'Revise menu item descriptions for summer seasonal offerings',
      assignedTo: 'Michael Chen',
      assignedBy: 'Marketing Team',
      dueDate: '2024-05-28',
      priority: 'medium',
      status: 'pending',
      category: 'Content Creation',
      estimatedHours: 6,
      completedHours: 0,
      client: 'Internal'
    },
    {
      id: 3,
      title: 'Event Planning Checklist Template',
      description: 'Create standardized checklist for corporate event planning process',
      assignedTo: 'Emma Rodriguez',
      assignedBy: 'Operations',
      dueDate: '2024-06-01',
      priority: 'medium',
      status: 'completed',
      category: 'Templates',
      estimatedHours: 8,
      completedHours: 8,
      client: 'Internal'
    },
    {
      id: 4,
      title: 'Client Feedback Form Design',
      description: 'Design post-event feedback form for service quality assessment',
      assignedTo: 'David Wilson',
      assignedBy: 'Quality Team',
      dueDate: '2024-06-10',
      priority: 'low',
      status: 'in-progress',
      category: 'Forms',
      estimatedHours: 3,
      completedHours: 1,
      client: 'Internal'
    },
    {
      id: 5,
      title: 'Vendor Agreement Documentation',
      description: 'Prepare service agreements with new decoration suppliers',
      assignedTo: 'Lisa Thompson',
      assignedBy: 'Procurement',
      dueDate: '2024-07-01',
      priority: 'high',
      status: 'overdue',
      category: 'Legal Documents',
      estimatedHours: 5,
      completedHours: 1,
      client: 'Multiple Vendors'
    },
    {
      id: 6,
      title: 'Social Media Content Calendar',
      description: 'Plan and write social media posts for next quarter marketing campaign',
      assignedTo: 'Sarah Johnson',
      assignedBy: 'Marketing Team',
      dueDate: '2024-06-20',
      priority: 'medium',
      status: 'pending',
      category: 'Marketing Content',
      estimatedHours: 10,
      completedHours: 0,
      client: 'Internal'
    }
  ]);

  // ✅ Selected task
  const [selectedTaskId, setSelectedTaskId] = useState<number>(tasks[0].id);
  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  // ✅ Modal states
  const [opened, setOpened] = useState(false);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [completedHours, setCompletedHours] = useState(0);

  // Sync selected task to modal fields
  useEffect(() => {
    if (selectedTask) {
      setStatus(selectedTask.status);
      setPriority(selectedTask.priority);
      setCompletedHours(selectedTask.completedHours);
    }
  }, [selectedTask]);

  const handleUpdateTask = () => {
    setTasks(prev =>
      prev.map(task =>
        task.id === selectedTaskId
          ? { ...task, status, priority, completedHours }
          : task
      )
    );
    setOpened(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive text-destructive-foreground">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="outline">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-primary" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getProgressPercentage = (completed: number, estimated: number) =>
    Math.round((completed / estimated) * 100);

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assigned Work</h1>
          <p className="text-muted-foreground">
            Track and manage assigned tasks and documentation
          </p>
        </div>

        <div className="flex gap-3">
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(Number(e.target.value))}
          >
            {tasks.map(task => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>

          <Button onClick={() => setOpened(true)}>Update Task</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">6</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== TASK CARD ===== */}
      {selectedTask && (
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              {getStatusIcon(selectedTask.status)}
              {selectedTask.title}
              {getStatusBadge(selectedTask.status)}
              {getPriorityBadge(selectedTask.priority)}
            </CardTitle>
            <p className="text-muted-foreground">{selectedTask.description}</p>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex gap-2 items-center">
                <User className="h-4 w-4" />
                {selectedTask.assignedTo}
              </div>
              <div className="flex gap-2 items-center">
                <Calendar className="h-4 w-4" />
                {selectedTask.dueDate}
              </div>
              <Badge variant="outline">{selectedTask.category}</Badge>
              <div>{selectedTask.client}</div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>
                  {selectedTask.completedHours}/{selectedTask.estimatedHours}h
                </span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${getProgressPercentage(
                      selectedTask.completedHours,
                      selectedTask.estimatedHours
                    )}%`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== MANTINE MODAL ===== */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Update Task" centered>
        <div className="space-y-4">
          <Select
            label="Status"
            value={status}
            onChange={(value) => setStatus(value!)}
            data={[
              { value: 'pending', label: 'Pending' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'overdue', label: 'Overdue' }
            ]}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(value) => setPriority(value!)}
            data={[
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]}
          />

          <NumberInput
            label="Completed Hours"
            value={completedHours}
            min={0}
            max={selectedTask?.estimatedHours}
            onChange={(value) => setCompletedHours(Number(value))}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssignedWord;