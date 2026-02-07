import Task from "../models/task.model.js"

/**
 * =========================
 * CREATE TASK
 * Admin / Manager only
 * =========================
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo,assignedBy } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      assignedBy
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * GET ALL TASKS
 * Admin / Manager → all
 * Employee → only assigned
 * =========================
 */
export const getTasks = async (req, res) => {
  try {
    let filter = { isActive: true };

    if (req.user.role === "Employee") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * GET TASK BY ID
 * =========================
 */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedBy", "name email")
      .populate("assignedTo", "name email");

    if (!task || !task.isActive) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Employee can view only own task
    if (
      req.user.role === "Employee" &&
      !task.assignedTo.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * UPDATE TASK (FULL UPDATE)
 * Admin / Manager only
 * =========================
 */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * DELETE TASK (SOFT DELETE)
 * Admin / Manager only
 * =========================
 */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.isActive = false;
    await task.save();

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =========================
 * UPDATE TASK STATUS
 * Employee (restricted)
 * Admin / Manager (allowed)
 * =========================
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task || !task.isActive) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Employee can update ONLY assigned task
    if (
      req.user.role === "Employee" &&
      !task.assignedTo.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Completion rule
    if (status === "Completed") {
      if (!comment || comment.trim() === "") {
        return res.status(400).json({
          message: "Comment is required to complete the task"
        });
      }

      task.comments.push({
        commenter: req.user._id,
        comment
      });

      task.completedAt = new Date();
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
