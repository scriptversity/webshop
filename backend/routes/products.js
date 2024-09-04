import express from "express";
import {
  getProductsHandler
} from "../handlers/productHandlers.js";

const router = express.Router();

router.route("/products").get(getProductsHandler);

export default router;