import express from "express";
import userRouter from "./user.routes.js";
import employeeRouter from "./employee.routes.js";
import managerRouter from "./manager.routes.js";
import storeRouter from "./store.routes.js";
import productRouter from "./product.routes.js";
import supplierRouter from "./supplier.routes.js";
import categoryRouter from "./category.routes.js";
import permissionRouter from "./permission.routes.js";
import roleRouter from "./role.router.js";
import sessionRouter from "./session.router.js";
import adminRouter from "./admin.router.js";
import { resErrors } from "../utils/resErrors.js";
import { verifytoken } from "../utils/middlewares/authJwt.js";
import crypto from "crypto";
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
    const nonce = crypto.randomBytes(16).toString('base64');
    // Guardar el nonce en la respuesta
    res.locals.nonce = nonce;
    // Configurar la política CSP
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    res.setHeader("Content-Security-Policy", `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net;`);
    next();
  })
  router.use("/api/admins", verifytoken, adminRouter);
  router.use("/api/users", verifytoken, userRouter);
  router.use("/api/employees", verifytoken, employeeRouter);
  router.use("/api/managers", verifytoken, managerRouter);  
  router.use("/api/stores", verifytoken, storeRouter);    
  router.use("/api/products", verifytoken, productRouter);
  router.use("/api/suppliers", verifytoken, supplierRouter);
  router.use("/api/categories", verifytoken, categoryRouter);
  router.use("/api/permissions", verifytoken, permissionRouter);
  router.use("/api/roles", verifytoken, roleRouter);
  router.use("/api/sessions/login", (req, res) => {
    res.status(200).render("signin")
  });
  router.use("/api/sessions", sessionRouter);
  router.use("/api", (req, res) => {
    res.status(200).render("index")
  });
  router.use("*", (req, res) => {
    resErrors(res, 404, "Non-existent route");
  });
  app.use(router);
};

export default apiRouter;
