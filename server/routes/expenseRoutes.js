import express from "express";
import { addExpense, listExpenses, removeExpense } from "../controllers/expenseController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, listExpenses);
router.post("/", auth, addExpense);
router.delete("/:id", auth, removeExpense);

export default router;
