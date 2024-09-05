import express from "express";
import {
  registerUserHandler,
  loginUserHandler,
  logoutUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  getUserProfileHandler,
} from "../handlers/authHandlers.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(registerUserHandler);
router.route("/login").post(loginUserHandler);
router.route("/logout").get(logoutUserHandler);

router.route("/password/forgot").post(forgotPasswordHandler);
router.route("/password/reset/:token").put(resetPasswordHandler);

router.route("/me").get(isAuthenticatedUser, getUserProfileHandler);

export default router;
