import express from "express";
import {
  newOrderHandler,
  getOrderDetailsHandler,
  myOrdersHandler,
} from "../handlers/orderHandlers.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.route("/orders/new").post(isAuthenticatedUser, newOrderHandler);
router.route("/orders/:id").get(isAuthenticatedUser, getOrderDetailsHandler);
router.route("/me/orders").get(isAuthenticatedUser, myOrdersHandler);

export default router;
