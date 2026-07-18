import mongoose from "mongoose";
import { Server } from "node:http";
// import { env } from "./config/envVars";
import app from "./app.js";
import { env } from "./config/envVars.js";

let server: undefined | Server;

mongoose
  .connect(env.MONGOOSE_DB_URL, {
    maxPoolSize: env.MONGOOSE_MAX_POOL_SIZE,
    minPoolSize: env.MONGOOSE_MIN_POOL_SIZE
  })
  .then(() => {
    console.log("db connected");
    server = app.listen(env.EXPRESS_PORT, () => {
      console.log("server running");
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const exitHandler = function () {
  if (server) {
    server.close(() => {
      console.log("server close");
    });
  }
  process.exit(1);
};

const unexpectedErrorHandler = () => {
  console.error("error ocurred serving closing");
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIG TERM received");
  if (server) {
    server.close();
  }
});
