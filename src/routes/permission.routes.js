import express from "express";
import permissionController from "../controllers/permission.controller.js";

const router = express.Router();

router.get("/", permissionController.getPermissions);
router.get("/:id", permissionController.getPermissionById);
router.patch("/:id", permissionController.updatePermission);
router.delete("/:id", permissionController.deletePermission);

export default router;
