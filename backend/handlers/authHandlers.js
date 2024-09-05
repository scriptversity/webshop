import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";

export const registerUserHandler = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJWTToken();
  res.status(201).json({
    // success: true,
    token,
    // user,
  });
})