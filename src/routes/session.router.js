import express from "express";
import sessionController from "../controllers/session.controller.js";
import { validateSignin } from "../utils/middlewares/validations.js";

const router = express.Router();
router.post("/signin", validateSignin(), sessionController.signIn);
router.delete("/logout", sessionController.logout);

export default router;
