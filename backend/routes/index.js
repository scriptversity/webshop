import { Router } from "express";

// Routes
import authRoutes from "./auth.js";
import productRoutes from "./products.js";
import orderRoutes from "./order.js";

const router = Router();

router.use("/api/v1/", authRoutes);
router.use("/api/v1/", productRoutes);
router.use("/api/v1/", orderRoutes);

export default router;
