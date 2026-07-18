import type { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../utils/catchAsync.js"
import UserService from "../services/user.service.js"
import { buildPaginationFilters } from "../utils/pagination.js"
import type { PaginationQueryOptions } from "../types/index.js"
import { ApiError } from "../utils/apiError.js"
import ScopeService from "../services/scope.service.js"

export default class UserController {
  static retrieveEmployees = catchAsync(
    async function (req: Request, res: Response) {
      const pagination = buildPaginationFilters<{}, { total?: number }>(req.query as PaginationQueryOptions);
      const { employees, total } = await UserService.paginate(pagination);
      pagination.total = total;
      res.status(httpStatus.OK).json({ code: httpStatus.OK, data: employees, pagination });
    }
  )

  static createEmployee = catchAsync(
    async function (req: Request, res: Response) {
      const user = await UserService.createEmployee(req.body);
      if (!user) throw new ApiError(400, "Bad Request: Error creating user please try again later!")
      await ScopeService.createEmployeeScopeByRole(String(user._id), req.body.role)
      res.status(httpStatus.OK).json({ code: httpStatus.OK, message: "Successfully" })
    }
  )

  static updateEmployee = catchAsync(
    async function (req: Request, res: Response) {
      const { employeeId } = req.params
      if (String(req.user?._id) !== employeeId && !req.grantedScopes?.includes("user:update:all")) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Forbidden: This action requires [user:update:all]");
      }
      await UserService.updateEmployee(employeeId as string, req.body);
      res.status(httpStatus.OK).json({ code: httpStatus.OK, message: "Successfully" });
    }
  )

  static deleteEmployee = catchAsync(
    async function (req: Request, res: Response) {
      const { employeeId } = req.params
      if (String(req.user?._id) === employeeId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Forbidden: Cannot delete Self Account!");
      }
      await UserService.deleteEmplyee(employeeId as string)
      res.status(httpStatus.OK).json({ code: httpStatus.OK, message: "Successfully" })
    }
  )

  static organizationTree = catchAsync(
    async function (req: Request, res: Response) {
      const { depth = "1", node } = req.query as { depth: string, node: string };
      const data = await UserService.buildOrganizationTree(node, parseInt(depth))
      res.status(httpStatus.OK).json({ code: httpStatus.OK, data })
    }
  )

  static getDirectReports = catchAsync(
    async function (req: Request, res: Response) {
      const { userId } = req.params;
      const data = await UserService.getDirectReports(userId as string);
      res.status(httpStatus.OK).json({ code: httpStatus.OK, data });
    }
  )

  static assignReportingManager = catchAsync(
    async function (req: Request, res: Response) {
      const { userId } = req.params;
      if (req.body.reportingManager === userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "An employee cannot be assigned to report to themselves.")
      }

      const { success, message } = await UserService.assignReportingManager(userId as string, req.body.reportingManager)
      if (!success) {
        throw new ApiError(httpStatus.BAD_REQUEST, message)
      }

      res.status(httpStatus.OK).json({ code: httpStatus.OK, message: "Successfully" })
    }
  )

  static assignUserRoles = catchAsync(
    async function (req: Request, res: Response) {
      const { userId } = req.params
      if (String(req.user?._id) === userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Forbidden: This action cannot be done!");
      }
      await ScopeService.updateEmployeeScopes(userId as string, req.body.scopeMap);
      res.status(httpStatus.OK).json({ code: httpStatus.OK, message: "Successfully" })
    }
  )
}
