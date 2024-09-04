import ErrorHandler from "../utils/errorHandler.js";

export const errorMiddleware = function (err, req, res, next) {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

  // res.status(error.statusCode).json({
  //   // success: false,
  //   // error: error.message,
  //   message: error.message,
  // });

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
