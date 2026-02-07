import express from "express";
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus
} from "../controllers/task.controller.js";

const router = express.Router();
router.get("/",getTasks);

router.get("/:id",getTaskById);

router.post("/",createTask);

router.put("/:id",updateTask);

router.delete("/:id",deleteTask);

router.patch("/:id/status",updateTaskStatus);

export default router;
