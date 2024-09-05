// Create token and save in the cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000 // 1 day times process.env.COOKIE_EXPIRES_TIME
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION",
  };
  res.status(statusCode).cookie("token", token, options).json({
    // success: true,
    // user,
    token,
  });
};

export default sendToken;
