import express from "express";
import roleController from "../controllers/role.controller.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";
import { validateCreateRole } from "../utils/middlewares/validations.js";

const router = express.Router();
router.get("/", checkPermissions("read:roles"), roleController.getRoles);
router.get("/:id", checkPermissions("read:roles"), roleController.getRoleById);
router.post("/", [checkPermissions("create:roles"), validateCreateRole()], roleController.createRole);
router.patch("/:id", checkPermissions("update:roles"), roleController.updateRole);
router.delete("/:id", checkPermissions("delete:roles"), roleController.deleteRole);

export default router;
