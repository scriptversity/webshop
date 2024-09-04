class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // Create stack property
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;

// const errorHandler = (err, req, res, next) => {
//   const error = {
//     statusCode: err?.statusCode || 500,
//     message: err?.message || "Internal Server Error",
//   };
//   res.status(error.statusCode).json({
//     success: false,
//     error: error.message,
//   });
// }

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}