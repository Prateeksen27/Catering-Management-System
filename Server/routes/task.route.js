import express from "express";
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getEventsForTaskCreation,
    addComment
} from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Apply verifyToken middleware to all task routes
router.use(verifyToken);

// Get events available for task creation (based on role)
router.get("/events", getEventsForTaskCreation);

// Get all tasks (filtered by role)
router.get("/", getTasks);

// Get task by ID
router.get("/:id", getTaskById);

// Create new task (Admin/Manager only)
router.post("/", createTask);

// Update task (Admin/Manager only)
router.put("/:id", updateTask);

// Delete task (soft delete - Admin/Manager only)
router.delete("/:id", deleteTask);

// Update task status
router.patch("/:id/status", updateTaskStatus);

// Add comment to task
router.post("/:id/comments", addComment);

export default router;
