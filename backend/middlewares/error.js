export class CustomErrorHandler extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.status = err.status || 500;
  return res.status(err.status).json({
    success: false,
    message: err.message,
  });
};
