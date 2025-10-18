import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Users, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, TextInput, NativeSelect } from '@mantine/core';
import { IconAt, IconTrash, IconUser, IconUserCircle } from '@tabler/icons-react';
import { useEmployeeStore } from '../store/useEmployeeStore';

const Employees: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'On-leave':
        return <Badge className="bg-warning text-warning-foreground">On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Events': 'bg-blue-500',
      'Catering': 'bg-green-500',
      'Media': 'bg-purple-500',
      'Design': 'bg-pink-500',
      'Sales': 'bg-orange-500',
      'Technical': 'bg-gray-500'
    };
    return colors[department as keyof typeof colors] || 'bg-gray-500';
  };
  const [opened, { open, close }] = useDisclosure(false)
  const [data, setData] = useState({
    name: "",
    empType: "Manager",
    email: ""
  })
  const empTypes = ["Manager", "Driver","Worker","Chef"]
  const { createNewEmployee, employees, isLoading, fetchAllEmployees,deleteEmployee } = useEmployeeStore()
  const handleAddEmployee = async () => {
    await createNewEmployee(data)
    close()
    setData({
      name: "",
      empType: "Manager",
      email: ""
    })
    fetchAllEmployees();
  }
  useEffect(() => {
    fetchAllEmployees()
  }, [])
  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        Loading Employee Details...
      </p>
    );
  }
  return (
    <div className="space-y-6">
      <Modal
        opened={opened}
        onClose={close}
        title="Add New Employee"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <TextInput label="Employee Name" placeholder='Enter employees full name' withAsterisk value={data.name} onChange={(e) => setData({ ...data, name: e.currentTarget.value })} leftSection={<IconUser className='w-6 h-6' />} />
        <TextInput my="sm" label="Employee Email" placeholder='Enter employees email' withAsterisk value={data.email} onChange={(e) => setData({ ...data, email: e.currentTarget.value })} leftSection={<IconAt className='w-6 h-6' />} />
        <NativeSelect my="sm" label="Employee Type" value={data.empType} onChange={(e) => setData({ ...data, empType: e.currentTarget.value })} withAsterisk data={empTypes} />
        <div className='flex justify-end'>
          <Button variant="filled" onClick={handleAddEmployee} radius="md">Add</Button>
        </div>
      </Modal>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground">Manage your team and track their activities</p>
        </div>
        <Button onClick={open}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{employees.length}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <User className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">29</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Cards */}
      <div className="grid gap-6">
        {employees.map((employee) => (
          <Card key={employee._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={employee.profilePic} alt={employee.name} />
                    <AvatarFallback>
                      {(employee.name &&
                        employee.name
                          .split(" ")
                          .map((n, i, arr) =>
                            i === 0 || i === arr.length - 1 ? n[0] : ""
                          )
                          .join("")
                      )?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <CardTitle className="flex items-center gap-2">
                      {employee.name}
                      {getStatusBadge(employee.status)}
                    </CardTitle>
                    <p className="text-muted-foreground">{employee.degn || "Not Updated"}</p>
                    <span className='text-muted-foreground text-xs'>Employee ID: {employee.empID}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{employee.currentProjects || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employee.location || "Not Updated"}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Skills & Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Joined: {new Date(employee.joiningDate).toLocaleDateString()}</span>
                <Button size="xs"  onClick={()=>deleteEmployee(employee._id)} leftSection={<IconTrash className='w-5 h-5' />} variant="filled" color='red'>Delete Employee</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Employees;