import express from "express";
import employeeController from "../controllers/employee.controller.js";
import { verifytoken } from "../utils/middlewares/authJwt.js";
import { validateCreateUser } from "../utils/middlewares/validations.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";

const router = express.Router();

router.post(
  "/",
  [
    verifytoken,
    checkPermissions("create:users"),
    validateCreateUser(),
  ],
  employeeController.createEmployee
);
router.get(
  "/",
  verifytoken,
  checkPermissions("read:users"),
  employeeController.getEmployees
);
router.get(
  "/:id",
  verifytoken,
  checkPermissions("read:users"),
  employeeController.getEmployeeById
);
router.patch(
  "/:id",
  verifytoken,
  checkPermissions("update:users"),
  employeeController.updateEmployee
);
router.delete(
  "/:id",
  verifytoken,
  checkPermissions("delete:users"),
  employeeController.deleteEmployee
);

export default router;
