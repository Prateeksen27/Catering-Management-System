import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AssignedWord: React.FC = () => {
  const tasks = [
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
  ];

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

  const getProgressPercentage = (completed: number, estimated: number) => {
    return Math.round((completed / estimated) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assigned Work</h1>
        <p className="text-muted-foreground">Track and manage assigned tasks and documentation</p>
      </div>

      {/* Stats Overview */}
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

      {/* Task List */}
      <div className="grid gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    {task.title}
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">{task.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold text-foreground">
                    {getProgressPercentage(task.completedHours, task.estimatedHours)}%
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{task.assignedTo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{task.dueDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline">{task.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{task.client}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Time Progress</span>
                  <span className="text-muted-foreground">
                    {task.completedHours}h / {task.estimatedHours}h
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(task.completedHours, task.estimatedHours)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <span>Assigned by: {task.assignedBy}</span>
                  <span className="ml-4">Task ID: #{task.id.toString().padStart(3, '0')}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  {task.status !== 'completed' && (
                    <Button size="sm">
                      Update Progress
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssignedWord;