import express from "express";
import {
  getProductsHandler,
  newProductHandler,
  getProductDetailsHandler,
  updateProductHandler,
} from "../handlers/productHandlers.js";

const router = express.Router();

router.route("/products").get(getProductsHandler);
router.route("/admin/products").post(newProductHandler);
router.route("/products/:id").get(getProductDetailsHandler);
router.route("/products/:id").put(updateProductHandler);

export default router;
