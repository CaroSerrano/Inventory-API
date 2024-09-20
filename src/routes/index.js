import express from "express";
import userRouter from "./user.routes.js";
import productRouter from "./product.routes.js";
import supplierRouter from "./supplier.routes.js";
import categoryRouter from "./category.routes.js";
import permissionRouter from "./permission.routes.js";
import roleRouter from "./role.router.js"
import sessionRouter from "./session.router.js"
import { resErrors } from "../utils/resErrors.js";
import { verifytoken } from "../utils/middlewares/authJwt.js";
const app = express();
app.use(express.json());

const apiRouter = (app) => {
  const router = express.Router();
  
  //Middleware para configurar los headers permitidos cuando las aplicaciones cruzan dominios.
  //x-access-token: Un encabezado personalizado que normalmente se utiliza para enviar tokens de acceso (como JWT)
  //Origin: Define el origen de la solicitud (normalmente incluido automáticamente por el navegador).
  //  Content-Type: Define el tipo de contenido que se está enviando en el cuerpo de la solicitud, por ejemplo, application/json.
  // Accept: Define los tipos de contenido que el cliente acepta en la respuesta.
  router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  })
  router.use("/api/users", verifytoken, userRouter);
  router.use("/api/products", verifytoken, productRouter);
  router.use("/api/suppliers", verifytoken, supplierRouter);
  router.use("/api/categories", verifytoken, categoryRouter);
  router.use("/api/permissions", verifytoken, permissionRouter);
  router.use("/api/roles", verifytoken, roleRouter);
  router.use("/api/sessions", sessionRouter);

  router.use("/api", (req, res) => {
    res.status(200).send("Welcome to Inventory-API")
  });
  router.use("*", (req, res) => {
    resErrors(res, 404, "Non-existent route");
  });
  app.use(router);
};

export default apiRouter;
