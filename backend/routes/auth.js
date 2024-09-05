import express from "express";
import {
  registerUserHandler,
  loginUserHandler,
  logoutUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "../handlers/authHandlers.js";

const router = express.Router();

router.route("/register").post(registerUserHandler);
router.route("/login").post(loginUserHandler);
router.route("/logout").get(logoutUserHandler);

router.route("/password/forgot").post(forgotPasswordHandler);
router.route("/password/reset/:token").put(resetPasswordHandler);

export default router;
