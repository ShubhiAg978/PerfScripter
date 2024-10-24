import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  // Generate a token for the user with user ID and email ID
  const tokenPayload = {
    _id: user._id,
    email: user.email,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(statusCode)
    .cookie("token", token, {
      expiresIn: "1h",
      httpOnly: true,
      maxAge: 7 * 60 * 60 * 1000, // 7 hour expiration
      sameSite: "lax",
      // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
