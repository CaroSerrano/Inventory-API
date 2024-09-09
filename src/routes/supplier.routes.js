import express from "express";
import supplierController from "../controllers/supplier.controller.js";
import { validateCreateSupplierAndCategory } from "../utils/validations.js";

const router = express.Router();

router.get("/", supplierController.getSuppliers);
router.post("/", validateCreateSupplierAndCategory(), supplierController.insertSupplier);
router.get("/:id", supplierController.getSupplierById);
router.patch("/:id", supplierController.updateSupplier);
router.delete("/:id", supplierController.deleteSupplier);

export default router;
