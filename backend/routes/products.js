import express from "express";
import {
  getProductsHandler,
  newProductHandler
} from "../handlers/productHandlers.js";

const router = express.Router();

router.route("/admin/products").post(newProductHandler);
router.route("/products").get(getProductsHandler);

export default router;