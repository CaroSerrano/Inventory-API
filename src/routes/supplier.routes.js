import express from "express";
import supplierController from "../controllers/supplier.controller.js";
import { validateCreateSupplierAndCategory } from "../utils/middlewares/validations.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";

const router = express.Router();

router.get("/", checkPermissions("read:suppliers"), supplierController.getSuppliers);
router.post("/", [checkPermissions("create:suppliers"), validateCreateSupplierAndCategory()], supplierController.insertSupplier);
router.get("/:id", checkPermissions("read:suppliers"), supplierController.getSupplierById);
router.get("/name/:name", checkPermissions("read:suppliers"), supplierController.getSupplierByName);
router.patch("/:id", checkPermissions("update:suppliers"), supplierController.updateSupplier);
router.delete("/:id", checkPermissions("delete:suppliers"), supplierController.deleteSupplier);

export default router;
