import type { Schema } from "mongoose";
import Scope from "../models/scopes.model.js";
import type { IUser } from "../models/user.model.js";
import type z from "zod";
import type UserValidation from "../validators/user.validation.js";
import { ROLE_SCOPES_MAPPING, SCOPES } from "../config/constants.js";
import type { SCOPES_TYPES } from "../types/index.js";

export default class ScopeService {
  private static model = Scope;

  static async getByUserId(userId: string | Schema.Types.ObjectId) {
    return await this.model
      .findOne({ user: userId as string })
      .populate<{ user: IUser }>("user", "-password -updatedAt -avatar -__v")
      .lean()
  }

  static async deleteByEmployeeId(employeeId: string) {
    this.model.findOneAndDelete({
      user: employeeId
    })
  }

  static async createEmployeeScopeByRole(
    userId: string,
    role: z.infer<typeof UserValidation.register>["body"]["role"]
  ) {
    const grantableScopes = new Set(ROLE_SCOPES_MAPPING[role]);
    await this.model.create({
      user: userId,
      scopeMap: SCOPES.reduce((acc, scope) => {
        acc[scope] = grantableScopes.has(scope)
        return acc
      }, {} as Record<SCOPES_TYPES[number], boolean>)
    })
  }

  static async updateEmployeeScopes(
    userId: string,
    scopes: z.infer<typeof UserValidation.updateScopes>["body"]["scopeMap"]
  ) {
    const payload = Object.keys(scopes).reduce((acc, scope) => {
      acc[`scopeMap.${scope}`] = scopes[scope] as boolean
      return acc
    }, {} as Record<string, boolean>)
    await this.model.findOneAndUpdate({ user: userId }, {
      $set: payload
    })
  }
}