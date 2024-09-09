import express from "express";
import userController from "../controllers/user.controller.js";
import { validateCreateUser } from "../utils/validations.js";

const router = express.Router();

router.get("/", userController.getUsers);
router.post("/", validateCreateUser(), userController.insertUser);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUser)

export default router;
