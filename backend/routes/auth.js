import express from "express";
import {
  registerUserHandler,
  loginUserHandler,
  logoutUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  getUserProfileHandler,
  updatePasswordHandler
} from "../handlers/authHandlers.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(registerUserHandler);
router.route("/login").post(loginUserHandler);
router.route("/logout").get(logoutUserHandler);

router.route("/password/forgot").post(forgotPasswordHandler);
router.route("/password/reset/:token").put(resetPasswordHandler);

router.route("/me").get(isAuthenticatedUser, getUserProfileHandler);

router.route("/password/update").put(isAuthenticatedUser, updatePasswordHandler);

export default router;
