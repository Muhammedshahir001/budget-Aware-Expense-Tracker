import express from "express";
import categoryController from "../controllers/categoryController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, categoryController.getAll);
router.post("/", auth, categoryController.create);
router.delete("/:id", auth, categoryController.remove);

export default router;
