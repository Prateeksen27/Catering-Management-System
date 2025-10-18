import Employee from "../models/user.model.js"

export const fetchAllEmployees = async(req,res)=>{
    try {
        const allEmployees = await Employee.find()
        res.status(200).json({allEmployees})
    } catch (error) {
        console.log("Error Fetching Employees",error);
        res.status(500).json({message:"Internal Server Error"})
        
    }
}

export const deleteEmployee = async(req,res)=>{
    const {id} = req.params
    try {
        await Employee.findByIdAndDelete(id)
        res.status(200).json({message:"Employee Deleted Successfully"})
    } catch (error) {
        console.log("Error Deleting Employee",error);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getAllEmployeesGrouped = async (req,res)=>{
    try {
        const employees = await Employee.find();
        const grouped = {
            admins:employees.filter(e => e.empType === "Admin"),
            managers:employees.filter(e => e.empType === "Manager"),
            workers:employees.filter(e => e.empType === "Worker"),
            drivers:employees.filter(e => e.empType === "Driver"),
            chefs:employees.filter(e => e.empType === "Chef"),
        };
        res.status(200).json({ success:true , data:grouped });
    } catch (error) {
        res.status(500).json({ success:true , message:error.message });
    }
};

export const assignStaffToProject = async (req, res) => {
  try {
    const { projectId, managerId, driverIds, workerIds, chefIds } = req.body;

    const updates = [];

    // Update manager
    if (managerId) {
      updates.push(
        Employee.findByIdAndUpdate(managerId, { assignedProject: projectId })
      );
    }

    // Update drivers
    if (driverIds?.length) {
      updates.push(
        Employee.updateMany(
          { _id: { $in: driverIds } },
          { assignedProject: projectId }
        )
      );
    }

    // Update workers
    if (workerIds?.length) {
      updates.push(
        Employee.updateMany(
          { _id: { $in: workerIds } },
          { assignedProject: projectId }
        )
      );
    }

    // Update chefs
    if (chefIds?.length) {
      updates.push(
        Employee.updateMany(
          { _id: { $in: chefIds } },
          { assignedProject: projectId }
        )
      );
    }

    await Promise.all(updates);

    res.status(200).json({ success: true, message: "Staff assigned successfully ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

