import express from "express";
const app = express();
import "dotenv/config";
import morgan from "morgan";
import cookieParser from "cookie-parser";

app.use(morgan("dev"));
app.use(express.json());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
})