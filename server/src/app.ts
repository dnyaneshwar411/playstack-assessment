import express from "express";
import type { Express, NextFunction, Request, Response } from "express"
import cors from "cors";
import httpStatus from "http-status";
import { ApiError } from "./utils/apiError.js";
import router from "./routes/index.js";
import { errorConverter, errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app: Express = express();

// security middlewares
// => helmet, xss, mongo sanitize, compression

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options("/", cors());
app.use("/", function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const timeStart = performance.now();
  res.on("finish", () => {
    const timeEnd = performance.now();
    console.log(
      req.method,
      "----",
      req.originalUrl,
      "----",
      res.statusCode,
      "----",
      (timeEnd - timeStart).toFixed(2) + "ms",
    );
  });
  next();
})

app.use("/api/v1", router);

app.use((_, __, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
