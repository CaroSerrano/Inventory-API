import express from "express";
import productController from "../controllers/product.controller.js";
import { validateCreateProduct} from "../utils/validations.js";

const router = express.Router();

router.get("/", productController.getProducts);
router.post("/", validateCreateProduct(), productController.insertProduct);
router.get("/:id", productController.getProductById);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.delete("/", productController.deleteManyProducts);

export default router;
