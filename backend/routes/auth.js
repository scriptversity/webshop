import express from "express";
import { registerUserHandler } from "../handlers/authHandlers.js";

const router = express.Router();

router.route("/register").post(registerUserHandler);

export default router;
