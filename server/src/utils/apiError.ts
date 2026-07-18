export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = '',
    options: { name: string } = { name: "Error"}
  ) {
    super(message);
    if (options.name) this.name = options.name
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}