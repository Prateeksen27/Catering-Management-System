import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Save, X } from "lucide-react";

interface Employee {
  _id: string;
  name: string;
  degn: string;
  empType: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  joiningDate: string;
  empID: string;
  assignedProject: string;
  status: string;
  profilePic?: string;
}

export default function EmployeeProfile() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  // Dummy Data Simulation
  useEffect(() => {
    const dummyEmployee: Employee = {
      _id: "1",
      name: "Sambot",
      degn: "Full Stack Developer",
      empType: "Employee",
      email: "sambot@example.com",
      phone: "9876543210",
      location: "Bangalore, India",
      skills: ["React", "Node.js", "MongoDB", "TailwindCSS"],
      joiningDate: "2023-07-15",
      empID: "EMP001",
      assignedProject: "Inventory Management System",
      status: "Active",
      profilePic: "https://i.pravatar.cc/150?img=3",
    };

    setTimeout(() => {
      setEmployee(dummyEmployee);
      setLoading(false);
    }, 1000); // Simulate loading delay
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSave = () => {
    setEditing(false);
    console.log("Updated employee:", employee);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-primary">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!employee) return <div className="text-center text-destructive">Employee not found</div>;

  return (
    <div className="p-6 flex justify-center bg-background min-h-screen">
      <Card className="max-w-3xl w-full border border-border shadow-md rounded-2xl bg-card">
        <CardContent className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={employee.profilePic || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 shadow-sm"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-foreground">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.degn || "No designation"}</p>
              <p className="text-sm text-primary font-medium mt-1">{employee.empID}</p>
              <Badge
                className={`mt-2 ${
                  employee.status === "Active"
                    ? "bg-success text-white"
                    : "bg-warning text-foreground"
                }`}
              >
                {employee.status}
              </Badge>
            </div>
          </div>

          <hr className="border-border" />

          {/* Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              value={employee.email}
              readOnly={!editing}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
              className="bg-input"
              placeholder="Email"
            />
            <Input
              value={employee.phone}
              readOnly={!editing}
              onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
              className="bg-input"
              placeholder="Phone"
            />
            <Input
              value={employee.location}
              readOnly={!editing}
              onChange={(e) => setEmployee({ ...employee, location: e.target.value })}
              className="bg-input"
              placeholder="Location"
            />
            <Input
              value={employee.assignedProject}
              readOnly={!editing}
              onChange={(e) => setEmployee({ ...employee, assignedProject: e.target.value })}
              className="bg-input"
              placeholder="Project"
            />
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-medium text-foreground mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {employee.skills.length > 0 ? (
                employee.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills listed</p>
              )}
            </div>
          </div>

          {/* Upload Picture */}
          {editing && (
            <div className="mt-4">
              <label className="text-sm font-medium text-foreground">Profile Picture</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            {editing ? (
              <>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover">
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)} className="bg-primary hover:bg-primary-hover">
                <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
