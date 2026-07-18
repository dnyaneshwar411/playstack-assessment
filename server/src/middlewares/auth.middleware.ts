import type { NextFunction, Request, Response } from "express";
import type { SCOPES_TYPES } from "../types/index.js";
import catchAsync from "../utils/catchAsync.js";
import ScopeService from "../services/scope.service.js";
import { ApiError } from "../utils/apiError.js";
import httpStatus from "http-status";;
import TokenService from "../services/token.service.js";

export const hasAccess = function (list: SCOPES_TYPES = []) {
  return catchAsync(
    async function (req: Request, res: Response, next: NextFunction) {
      const valid = await TokenService.validateToken<{ _id: string }>(req.cookies.access);
      if (!valid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication token missing. Please log in again.");
      }

      const scopes = await ScopeService.getByUserId(valid._id);
      if (!scopes) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Access privileges profile not found for this account. Contact your administrator."
        );
      }

      const grantedScopes = list.filter(scope => scopes.scopeMap?.[scope]);

      if (list.length && !grantedScopes.length) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          `Forbidden: This action requires at least one of the following permissions: [${list.join(", ")}]`
        );
      }

      req.grantedScopes = grantedScopes
      req.user = scopes.user;
      req.scopes = scopes.scopeMap;

      next()
    }
  )
}