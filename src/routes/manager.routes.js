import express from "express";
import managerController from "../controllers/manager.controller.js";
import productController from "../controllers/product.controller.js";
import { verifytoken } from "../utils/middlewares/authJwt.js";
import { validateCreateUser } from "../utils/middlewares/validations.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";

// VIEWS
const router = express.Router();
router.get("/dashboard", (req, res) => {
  res.status(200).render("manager");
});

router.get(
  "/products",
  verifytoken,
  checkPermissions("read:products"),
  productController.showProducts
);


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
