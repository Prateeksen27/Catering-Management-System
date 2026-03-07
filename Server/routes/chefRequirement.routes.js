import express from "express";
import multer from "multer";
import path from "path";

import {
  getMyRequirements,
  getAllRequirements,
  submitRequirement,
  updateRequirement,
  getRequirementById,
  updateRequirementStatus,
  uploadRequirementFile,
  calculateGrocery,
} from "../controllers/chefRequirement.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* ==========================
   MULTER CONFIG
========================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/requirements/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, PNG, JPG, and Excel allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

/* ==========================
   ROUTES
========================== */

// Chef
router.get("/my-requirements", verifyToken, getMyRequirements);
router.post("/", verifyToken, submitRequirement);
router.post("/calculate", verifyToken, calculateGrocery);

// Admin / Manager
router.get("/", verifyToken, getAllRequirements);
router.patch("/:id/status", verifyToken, updateRequirementStatus);

// Shared
router.get("/:id", verifyToken, getRequirementById);
router.put("/:id", verifyToken, updateRequirement);
router.post("/:id/upload", verifyToken, upload.single("file"), uploadRequirementFile);

export default router;