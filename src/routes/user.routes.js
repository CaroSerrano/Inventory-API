import express from "express";
import userController from "../controllers/user.controller.js";
import { verifytoken } from "../utils/middlewares/authJwt.js";
import { validateCreateUser } from "../utils/middlewares/validations.js";
import { validateSignin } from "../utils/middlewares/validations.js";
import { checkDuplicateEmail } from "../utils/middlewares/verifySignUp.js";
import { checkRole } from "../utils/middlewares/checkRole.js";

const router = express.Router();

router.post("/signup", [checkDuplicateEmail, validateCreateUser()], userController.signUp);
router.post("/signin", validateSignin(), userController.signIn);
router.get("/", verifytoken, checkRole([1]), userController.getUsers);
router.get("/:id", verifytoken, checkRole([1]), userController.getUserById);
router.patch("/:id", verifytoken, checkRole([1]), userController.updateUser)
router.delete("/:id", verifytoken, checkRole([1]), userController.deleteUser)

export default router;
