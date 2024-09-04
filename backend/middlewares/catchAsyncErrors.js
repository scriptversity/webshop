// export default (controllerFunction) => (req, res, next) =>
//   Promise.resolve(controllerFunction(req, res, next)).catch(next);

// export default function (controllerFunction) {
//   return function (req, res, next) {
//     Promise.resolve(controllerFunction(req, res, next)).catch(next);
//   };
// }

export default function errorHandlingMiddleware(func) {
  return async (req, res, next) => {
    try {
      await Promise.resolve(func(req, res, next));
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  };
}