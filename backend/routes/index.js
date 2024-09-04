import { Router } from "express";

// Routes
import authRoutes from "./auth.js";
import productRoutes from "./products.js";


const router = Router();

router.use("/api/v1/", authRoutes);
router.use("/api/v1/", productRoutes);


export default router;
