import express from "express";
import {
  newOrderHandler,
  getOrderDetailsHandler,
  myOrdersHandler,
  allOrdersHandler,
  updateOrderHandler,
} from "../handlers/orderHandlers.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.route("/orders/new").post(isAuthenticatedUser, newOrderHandler);
router.route("/orders/:id").get(isAuthenticatedUser, getOrderDetailsHandler);
router.route("/me/orders").get(isAuthenticatedUser, myOrdersHandler);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allOrdersHandler);

router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderHandler);

export default router;
