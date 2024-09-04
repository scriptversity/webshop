import express from "express";
const app = express();
import { connectDatabase } from "./config/dbConnect.js";
import routes from "./routes/index.js";
import "dotenv/config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errors.js";
import { notFound } from "./utils/errorHandler.js";

// database connection
connectDatabase();

app.use(morgan("dev"));
app.use(express.json());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use(routes);

// Using error middleware
app.use(errorMiddleware);

// Handle not found
app.use(notFound);

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
