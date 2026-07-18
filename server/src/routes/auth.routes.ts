import express from "express";
import { validate } from "../middlewares/validate.js";
import AuthValidation from "../validators/auth.validation.js";
import AuthController from "../controllers/auth.controller.js";
import { hasAccess } from "../middlewares/auth.middleware.js";

const authRoutes: express.Router = express.Router();

authRoutes
  .route("/login")
  .post(validate(AuthValidation.login), AuthController.login);

authRoutes.route("/logout").post(hasAccess(), AuthController.logout);

export default authRoutes;
