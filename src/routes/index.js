import express from "express";
import userRouter from "./user.routes.js";
import productRouter from "./product.routes.js";
import supplierRouter from "./supplier.routes.js";
import categoryRouter from "./category.routes.js";
import { resErrors } from "../utils/resErrors.js";

const app = express();
// Configuración del Middleware
app.use(express.json());

const apiRouter = (app) => {
  const router = express.Router();
  router.use("/api/users", userRouter);
  router.use("/api/products", productRouter);
  router.use("/api/suppliers", supplierRouter);
  router.use("/api/categories", categoryRouter);
  router.use("/api", (req, res) => {
    res.status(200).send("Welcome to Inventory-API")
  });
  router.use("*", (req, res) => {
    resErrors(res, 404, "Ruta inexistente");
  });
  app.use(router);
};

export default apiRouter;
