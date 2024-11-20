import express from "express";
import productController from "../controllers/product.controller.js";
import userController from "../controllers/user.controller.js";
import storeController from "../controllers/store.controller.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";
import supplierController from "../controllers/supplier.controller.js";
import categoryController from "../controllers/category.controller.js";

const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.status(200).render("admin");
});
router.get(
  "/products",
  checkPermissions("read:products"),
  productController.showProducts
);

router.get("/create-product", (req, res) => {
  res.status(200).render("product-create");
});

router.get("/update-product/:id", (req, res) => {
  const productId = req.params.id;
  res.status(200).render("product-update", { productId });
});

router.get("/users", checkPermissions("read:users"), userController.showUsers);

router.get(
  "/create-user",
  checkPermissions("create:users"),
  userController.showCreateUser
);

router.get(
  "/update-user/:id",
  checkPermissions("update:users"),
  userController.showUpdateUser
);

router.get(
  "/stores",
  checkPermissions("read:stores"),
  storeController.showStores
);
router.get(
  "/create-store",
  checkPermissions("create:stores"),
  storeController.showCreateStore
);
router.get(
  "/update-store/:id",
  checkPermissions("update:stores"),
  storeController.showUpdateStore
);

router.get(
  "/suppliers",
  checkPermissions("read:suppliers"),
  supplierController.showSuppliers
);

router.get(
  "/categories",
  checkPermissions("read:categories"),
  categoryController.showCategories
);

export default router;
