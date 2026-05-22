import express from "express";
const router = express.Router();

import { createSubmission } from "../controllers/HomeController.js";

router.post("/create", createSubmission);

export default router;