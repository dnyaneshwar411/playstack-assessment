import z from "zod"
import User from "../models/user.model.js"
import type { PaginationOptions } from "../types/index.js";
import AuthValidation from "../validators/auth.validation.js";
import { hashString, validateHash } from "../utils/hash.js";
import TokenService from "./token.service.js";
import type UserValidation from "../validators/user.validation.js";
import ScopeService from "./scope.service.js";

export default class UserService {
  private static model = User;

  static async paginate(filters: PaginationOptions) {
    const dbQuery: Record<string, object> = {}
    if (typeof filters.query === "string") {
      dbQuery.name = { $regex: filters.query, options: "i" }
      dbQuery.email = { $regex: filters.query, options: "i" }
      dbQuery.mobileNumber = { $regex: filters.query, options: "i" }
    }

    const [employees, total] = await Promise.all([
      this.model
        .find(dbQuery)
        .select("-password -updatedAt -__v")
        .limit(filters.limitNumber)
        .skip(filters.pageNumber - 1)
        .lean(),
      this.model.countDocuments()
    ]);
    return {
      employees,
      total
    };
  }

  static async generateEmployeeId(sequentialId?: number) {
    const currentYear = new Date().getFullYear();
    const paddedSequence = sequentialId
      ? String(sequentialId).padStart(4, '0')
      : await this.model.countDocuments() + 1;
    return `${"EMP"}-${currentYear}-${paddedSequence}`;
  }

  static async login(payload: z.infer<typeof AuthValidation.login>["body"]) {
    const user = await this.model.findOne({
      email: payload.email
    })
      .select("+password")
      .select("-updatedAt -__v")
      .lean()

    if (!user) return { success: false, message: "User not found" }

    if (!user.password) return { success: false, message: "Password for you is not set." }

    const validPassword = await validateHash(payload.password, user.password)
    if (!validPassword) return { success: false, message: "InValid Password" }

    const access = await TokenService.createToken({ _id: user._id })
    const refresh = await TokenService.createToken({ _id: user._id })

    delete user.password
    // tbd s3 url convert in url
    return {
      success: true,
      tokens: {
        access,
        refresh
      },
      user,
    }
  }

  static async createEmployee(payload: z.infer<typeof UserValidation.register>["body"]) {
    const userBody = new this.model(payload);
    userBody.password = await hashString(payload.password);;
    if (userBody.avatar) userBody.avatar.private = false;
    return await this.model.create(userBody);
  }

  static async updateEmployee(employeeId: string, payload: z.infer<typeof UserValidation.update>["body"]) {
    return await this.model.findByIdAndUpdate(employeeId, {
      $set: payload
    });
  }

  static async deleteEmplyee(employeeId: string) {
    return await Promise.all([
      this.model.findByIdAndDelete(employeeId),
      ScopeService.deleteByEmployeeId(employeeId)
    ])
  }

  static async buildOrganizationTree() {
    // tbd needs a little bit more than this should be recursive
    return await this.model.find({

    })
  }

  static async getDirectReports(employeeId: string) {
    // tbd needs a little bit more than this should be recursive
    return await this.model.find({
      reportingManager: employeeId
    })
  }

  static async assignReportingManager(userId: string, reportingManager: string) {
    // tbd needs a little bit more than this should be recursive
    return await this.model.find({

    })
  }
}