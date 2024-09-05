import express from "express";
import {
  registerUserHandler,
  loginUserHandler,
} from "../handlers/authHandlers.js";

const router = express.Router();

router.route("/register").post(registerUserHandler);
router.route("/login").post(loginUserHandler);

export default router;
