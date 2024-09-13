import express from "express";
import categoryController from "../controllers/category.controller.js";
import { validateCreateSupplierAndCategory } from "../utils/middlewares/validations.js";

const router = express.Router();

router.get("/", categoryController.getCategories);
router.post("/", validateCreateSupplierAndCategory(), categoryController.insertCategory);
router.get("/:id", categoryController.getCategoryById);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deletecategory);

export default router;
