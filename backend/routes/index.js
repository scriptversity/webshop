import { Router } from "express";

import productRoutes from "./products.js";

const router = Router();

router.use("/api/v1/", productRoutes);


export default router;
