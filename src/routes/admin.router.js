import express from "express";
import productController from "../controllers/product.controller.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";

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
  res.status(200).render("product-update", {productId});
});
export default router;
