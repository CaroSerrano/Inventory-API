import express from "express";
import userRouter from "./user.routes.js";
import { resErrors } from "../utils/resErrors.js";

const app = express();
// Configuración del Middleware
app.use(express.json());

const apiRouter = (app) => {
  const router = express.Router();
  router.use("/api/users", userRouter);
  router.use("*", (req, res) => {
    resErrors(res, 404, "Ruta inexistente");
  });
  app.use(router);
};

export default apiRouter;
