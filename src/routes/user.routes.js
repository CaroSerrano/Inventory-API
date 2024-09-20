import express from "express";
import userController from "../controllers/user.controller.js";
import { verifytoken } from "../utils/middlewares/authJwt.js";
import { validateCreateUser } from "../utils/middlewares/validations.js";
import { checkDuplicateEmail } from "../utils/middlewares/checkDuplicateEmail.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";

const router = express.Router();

router.post(
  "/",
  [
    verifytoken,
    checkPermissions("create:users"),
    checkDuplicateEmail,
    validateCreateUser(),
  ],
  userController.createUser
);
router.get(
  "/",
  verifytoken,
  checkPermissions("read:users"),
  userController.getUsers
);
router.get(
  "/:id",
  verifytoken,
  checkPermissions("read:users"),
  userController.getUserById
);
router.patch(
  "/:id",
  verifytoken,
  checkPermissions("update:users"),
  userController.updateUser
);
router.delete(
  "/:id",
  verifytoken,
  checkPermissions("delete:users"),
  userController.deleteUser
);

export default router;
