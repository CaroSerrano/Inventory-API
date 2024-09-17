import express from "express";
import categoryController from "../controllers/category.controller.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";
import { validateCreateSupplierAndCategory } from "../utils/middlewares/validations.js";

const router = express.Router();

router.get("/", checkPermissions("read:categories"), categoryController.getCategories);
router.post("/", [checkPermissions("create:categories"), validateCreateSupplierAndCategory()], categoryController.insertCategory);
router.get("/:id", checkPermissions("read:categories"), categoryController.getCategoryById);
router.patch("/:id", checkPermissions("update:categories"), categoryController.updateCategory);
router.delete("/:id", checkPermissions("delete:categories"), categoryController.deletecategory);

export default router;
