import Booked from "../models/Booked.model.js";
import Employee from "../models/user.model.js"

export const fetchAllEmployees = async (req, res) => {
  try {
    const allEmployees = await Employee.find()
    res.status(200).json({ allEmployees })
  } catch (error) {
    console.log("Error Fetching Employees", error);
    res.status(500).json({ message: "Internal Server Error" })

  }
}

export const deleteEmployee = async (req, res) => {
  const { id } = req.params
  try {
    await Employee.findByIdAndDelete(id)
    res.status(200).json({ message: "Employee Deleted Successfully" })
  } catch (error) {
    console.log("Error Deleting Employee", error);
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getAllEmployeesGrouped = async (req, res) => {
  try {
    const employees = await Employee.find();
    const grouped = {
      admin: employees.filter(e => e.empType === "Admin"),
      manager: employees.filter(e => e.empType === "Manager"),
      worker: employees.filter(e => e.empType === "Worker"),
      driver: employees.filter(e => e.empType === "Driver"),
      chef: employees.filter(e => e.empType === "Chef"),
    };
    res.status(200).json({ success: true, data: grouped });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
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

export const getAllAssignedEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found!"
      })
    }

    let query = {};
    switch (employee.empType) {
      case "Chef": {
        query = { assignedChefs: id }
      }
        break;
      case "Driver":
        query = { assignedVehicles: id };
        break;
      case "Worker":
      case "Manager":
        query = { assignedStaff: id };
        break;
      default:
        query = {
          $or: [
            { assignedStaff: id },
            { assignedChefs: id },
            { assignedVehicles: id },
          ],
        };
        break;


    }
    const events = await Booked.find(query)
      .populate("assignedStaff", "name empType")
      .populate("assignedChefs", "name empType")
      .populate("assignedVehicles", "name empType")
      .select("eventName eventDate eventTime venue bookingStatus clientName totalAmount");

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching assigned events", error });
  }
}