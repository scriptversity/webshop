import express from "express";
import {
  registerUserHandler,
  loginUserHandler,
  logoutUserHandler,
} from "../handlers/authHandlers.js";

const router = express.Router();

router.route("/register").post(registerUserHandler);
router.route("/login").post(loginUserHandler);
router.route("/logout").get(logoutUserHandler);

export default router;
