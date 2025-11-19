import express from "express";
import budgetController from "../controllers/budgetController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, budgetController.getAll);
router.post("/", auth, budgetController.createOrUpdate); 
router.delete("/:id", auth, budgetController.remove);

export default router;
