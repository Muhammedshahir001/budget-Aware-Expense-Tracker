import express from "express";
import auth from "../middleware/auth.js";
import reportController from "../controllers/reportController.js";

const router = express.Router();

router.get("/", auth, reportController.getMonthly);

export default router;
