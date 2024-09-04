import express from "express";
import {
  getProductsHandler,
  newProductHandler,
  getProductDetailsHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../handlers/productHandlers.js";

const router = express.Router();

router.route("/products").get(getProductsHandler);
router.route("/admin/products").post(newProductHandler);
router.route("/products/:id").get(getProductDetailsHandler);
router.route("/products/:id").put(updateProductHandler);
router.route("/products/:id").delete(deleteProductHandler);

export default router;
