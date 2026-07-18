import type { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../utils/catchAsync.js"
import UserService from "../services/user.service.js"
import { ApiError } from "../utils/apiError.js"
import { env } from "../config/envVars.js"

export default class AuthController {
  static login = catchAsync(
    async function (req: Request, res: Response) {
      const { success, message, user, tokens } = await UserService.login(req.body);
      if (!success) throw new ApiError(httpStatus.BAD_REQUEST, message as string);

      res.cookie("access", tokens?.access, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: env.JWT_ACCESS_EXPIRATION
      })
      res.cookie("refresh", tokens?.refresh, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: env.JWT_REFRESH_EXPIRATION
      })

      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        data: user
      })
    }
  )

  static logout = catchAsync(
    async function (req: Request, res: Response) {
      res.clearCookie("access")
      res.clearCookie("refresh")
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: "Successfully Logged Out"
      })
    }
  )
}