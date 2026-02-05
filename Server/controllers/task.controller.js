import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assignedTo } = req.body;

    if (!title || !deadline || !assignedTo?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (new Date(deadline) < new Date()) {
      return res.status(400).json({ message: "Deadline cannot be in the past" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      deadline,
      assignedTo
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { role, _id } = req.user || {};
    let filter = { isActive: true };

    if (["Driver","Worker","Chef"].includes(role)) {
      filter.assignedTo = _id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE TASK
 * WORKER → status only
 * ADMIN / MANAGER → full update
 */
export const updateTask = async (req, res) => {
  try {
    const { role } = req.user || {};
    const task = await Task.findById(req.params.id);

    if (!task || !task.isActive) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (role === "WORKER") {
      // Worker can ONLY update status
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status required" });
      }
      task.status = status;
    } else {
      // Admin / Manager
      const { title, description, priority, deadline, assignedTo, status } = req.body;

      if (title) task.title = title;
      if (description) task.description = description;
      if (priority) task.priority = priority;
      if (deadline) task.deadline = deadline;
      if (assignedTo) task.assignedTo = assignedTo;
      if (status) task.status = status;
    }

    await task.save();
    res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE TASK (Soft delete)
 * ADMIN / MANAGER only
 */
export const deleteTask = async (req, res) => {
  try {
    const { role } = req.user || {};

    if (!["ADMIN", "MANAGER"].includes(role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.isActive = false;
    await task.save();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
