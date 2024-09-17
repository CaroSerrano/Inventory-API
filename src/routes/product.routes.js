import express from "express";
import productController from "../controllers/product.controller.js";
import { validateCreateProduct} from "../utils/middlewares/validations.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";

const router = express.Router();

router.get("/", checkPermissions("read:products"), productController.getProducts);
router.get("/:id", checkPermissions("read:products"), productController.getProductById);
router.post("/", [checkPermissions("create:products"),validateCreateProduct()], productController.insertProduct);
router.patch("/:id", checkPermissions("update:products"), productController.updateProduct);
router.delete("/:id", checkPermissions("delete:products"), productController.deleteProduct);
router.delete("/", checkPermissions("delete:products"), productController.deleteManyProducts);

export default router;
