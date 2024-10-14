import express from "express";
import managerController from "../controllers/manager.controller.js";
import { verifytoken } from "../utils/middlewares/authJwt.js";
import { validateCreateUser } from "../utils/middlewares/validations.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";

const router = express.Router();

router.post(
  "/",
  verifytoken,
  checkPermissions("create:users"),
  validateCreateUser(),
  managerController.createManager
);
router.get(
  "/",
  verifytoken,
  checkPermissions("read:users"),
  managerController.getManagers
);
router.get(
  "/:id",
  verifytoken,
  checkPermissions("read:users"),
  managerController.getManagerById
);
router.patch(
  "/:id",
  verifytoken,
  checkPermissions("update:users"),
  managerController.updateManager
);
router.delete(
  "/:id",
  verifytoken,
  checkPermissions("delete:users"),
  managerController.deleteManager
);

export default router;
