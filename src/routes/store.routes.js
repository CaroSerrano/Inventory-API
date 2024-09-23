import express from "express";
import storeController from "../controllers/store.controller.js";
import { verifytoken } from "../utils/middlewares/authJwt.js";
import { validateCreateStore } from "../utils/middlewares/validations.js";
import { checkPermissions } from "../utils/middlewares/checkPermissions.js";

const router = express.Router();

router.post(
  "/",
  [
    verifytoken,
    checkPermissions("create:stores"),
    validateCreateStore(),
  ],
  storeController.createStore
);
router.get(
  "/",
  verifytoken,
  checkPermissions("read:stores"),
  storeController.getStores
);
router.get(
  "/:id",
  verifytoken,
  checkPermissions("read:stores"),
  storeController.getStoreById
);
router.patch(
  "/:id",
  verifytoken,
  checkPermissions("update:stores"),
  storeController.updateStore
);
router.delete(
  "/:id",
  verifytoken,
  checkPermissions("delete:stores"),
  storeController.deleteStore
);

export default router;
