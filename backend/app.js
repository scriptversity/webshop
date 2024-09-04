import express from "express";
const app = express();
import { connectDatabase } from "./config/dbConnect.js";
import routes from "./routes/index.js";
import "dotenv/config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errors.js";
import { notFound } from "./utils/errorHandler.js";

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught expection");
  process.exit(1);
});

// database connection
connectDatabase();

app.use(morgan("dev"));
app.use(express.json());

// console.log(first) // to test uncaughtException

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use(routes);

// Using error middleware
app.use(errorMiddleware);

// Handle not found
app.use(notFound);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT || 5000} in ${
      process.env.NODE_ENV || "test"
    } mode.`
  );
});

//Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
