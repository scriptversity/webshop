import express from "express";
import {
  newOrderHandler,
} from "../handlers/orderHandlers.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.route("/orders/new").post(isAuthenticatedUser, newOrderHandler);

export default router;
