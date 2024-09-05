import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// Register user   =>  /api/v1/register
export const registerUserHandler = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });

  // const token = user.getJWTToken();
  // res.status(201).json({
  //   // success: true,
  //   token,
  //   // user,
  // });

  sendToken(user, 201, res);
});

// Login user   =>  /api/v1/login
export const loginUserHandler = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  // Find user in the database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // const token = user.getJWTToken();
  // res.status(200).json({
  //   // success: true,
  //   token,
  // });
  sendToken(user, 200, res);
});

// Logout user   =>  /api/v1/logout
export const logoutUserHandler = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
    })
    .json({
      // success: true,
      message: "Logged out",
    });
});

// Forgot password   =>  /api/v1/password/forgot
export const forgotPasswordHandler = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorHandler("User not found with this email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();
    // await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

    // const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`;
    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
      await sendEmail({
        email: user.email,
        subject: "WEBSHOP Password Recovery",
        message,
      });
      res.status(200).json({
        // success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      // await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error?.message, 500));
    }
  }
);

// Reset password   =>  /api/v1/password/reset/:token
export const resetPasswordHandler = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  
  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  // await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res);
});