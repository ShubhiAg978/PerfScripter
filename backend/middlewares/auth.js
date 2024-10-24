import jwt from "jsonwebtoken";

// Middleware to validate token
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(req);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized: Invalid token" });
      }

      req.userId = decoded.userId; // Attach userId to request object
      next();
    });
  } catch (e) {
    return req.next();
  }
};
