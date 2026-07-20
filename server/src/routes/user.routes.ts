import express from "express";
import UserController from "../controllers/user.controller.js";
import { hasAccess } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import UserValidation from "../validators/user.validation.js";

const userRoutes: express.Router = express.Router();

userRoutes.route("/dashboard")
  .get(hasAccess(), UserController.dashboard)

userRoutes.route("/me")
  .get(hasAccess(["user:read:own"]), UserController.myProfile)

userRoutes
  .route("/employees")
  .get(hasAccess(["user:read:all"]), UserController.retrieveEmployees)
  .post(
    validate(UserValidation.register),
    hasAccess(["user:create:all"]),
    UserController.createEmployee,
  );

userRoutes
  .route("/employees/:employeeId")
  .get(validate(UserValidation.paramMongoObjectId("employeeId")), hasAccess(["user:read:all"]), UserController.retrieveEmployeeById)
  .post(
    validate(UserValidation.update),
    hasAccess(["user:update:all", "user:update:own"]),
    UserController.updateEmployee,
  )
  .delete(
    validate(UserValidation.delete),
    hasAccess(["user:delete:all"]),
    UserController.deleteEmployee,
  );

userRoutes
  .route("/organization/tree")
  .get(validate(UserValidation.organizationTree), hasAccess(), UserController.organizationTree);

userRoutes
  .route("/:userId/subordinates")
  .get(
    validate(UserValidation.paramMongoObjectId("userId")),
    hasAccess(["user:read:all", "user:read:own"]),
    UserController.getDirectReports,
  );

userRoutes
  .route("/:userId/manager")
  .put(
    validate(UserValidation.assignReportingManager),
    hasAccess(["manager:assign:all"]),
    UserController.assignReportingManager,
  );

userRoutes
  .route("/:userId/roles")
  .put(
    validate(UserValidation.updateScopes),
    hasAccess(["role:assign:basic", "role:assign:admin"]),
    UserController.assignUserRoles,
  );

export default userRoutes;
