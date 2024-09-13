import express from "express";
import productController from "../controllers/product.controller.js";
import { validateCreateProduct} from "../utils/middlewares/validations.js";
import { verifytoken } from "../utils/middlewares/authJwt.js";
import { checkRole } from "../utils/middlewares/checkRole.js";

const router = express.Router();

router.get("/", verifytoken, productController.getProducts);
router.get("/:id", verifytoken, productController.getProductById);
router.post("/", [verifytoken, checkRole([1, 2, 3]),validateCreateProduct()], productController.insertProduct);
router.patch("/:id", [verifytoken, checkRole([1, 2, 3])], productController.updateProduct);
router.delete("/:id", [verifytoken, checkRole([1, 2])], productController.deleteProduct);
router.delete("/", [verifytoken, checkRole([1, 2])], productController.deleteManyProducts);

export default router;
