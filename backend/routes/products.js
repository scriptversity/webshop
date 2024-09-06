import express from "express";
import {
  getProductsHandler,
  newProductHandler,
  getProductDetailsHandler,
  updateProductHandler,
  deleteProductHandler,
  createProductReviewHandler,
  getProductReviewsHandler,
  deleteProductReviewHandler,
} from "../handlers/productHandlers.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.route("/products").get(getProductsHandler);

router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProductHandler);

router.route("/products/:id").get(getProductDetailsHandler);

router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProductHandler);

router
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProductHandler);

router
  .route("/reviews")
  .get(isAuthenticatedUser, getProductReviewsHandler)
  .post(isAuthenticatedUser, createProductReviewHandler);

router
  .route("/admin/reviews")
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    deleteProductReviewHandler
  );

export default router;
