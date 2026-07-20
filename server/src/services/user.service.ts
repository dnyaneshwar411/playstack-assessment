import z from "zod"
import User from "../models/user.model.js"
import type { PaginationOptions } from "../types/index.js";
import AuthValidation from "../validators/auth.validation.js";
import { hashString, validateHash } from "../utils/hash.js";
import TokenService from "./token.service.js";
import type UserValidation from "../validators/user.validation.js";
import ScopeService from "./scope.service.js";
import { Types } from "mongoose";

type OrgTreeNode = {
  _id: string;
  name?: string;
  email: string;
  designation?: string;
  department: string;
  avatar?: any;
  children: OrgTreeNode[];
}

export default class UserService {
  private static model = User;

  static async dashboard() {
    const [metrics] = await User.aggregate([
      {
        $facet: {
          stats: [
            {
              $group: {
                _id: null,
                totalEmployees: { $sum: 1 },
                activeEmployees: {
                  $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
                },
                inactiveEmployees: {
                  $sum: { $cond: [{ $eq: ["$status", "In Active"] }, 1, 0] }
                }
              }
            }
          ],
          departmentBreakdown: [
            {
              $group: {
                _id: "$department",
                count: { $sum: 1 }
              }
            }
          ],
          recentHiresLog: [
            { $sort: { joiningDate: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                department: 1,
                designation: 1,
                status: 1
              }
            }
          ]
        }
      }
    ]);

    const baseStats = metrics?.stats?.[0] || { totalEmployees: 0, activeEmployees: 0, inactiveEmployees: 0 };
    const departments = metrics?.departmentBreakdown || [];
    const recentHires = metrics?.recentHiresLog || [];

    return {
      summary: {
        totalEmployees: baseStats.totalEmployees,
        activeEmployees: baseStats.activeEmployees,
        inactiveEmployees: baseStats.inactiveEmployees,
        departmentCount: departments.length
      },
      departments,
      recentHires
    };
  }

  static async paginate(filters: PaginationOptions) {
    const dbQuery: Record<string, object> = {}
    if (typeof filters.query === "string" && filters.query.length > 3) {
      dbQuery.name = { $regex: filters.query, $options: "i" }
      dbQuery.email = { $regex: filters.query, $options: "i" }
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

  static async retrieveEmployeeById(employeeId: string) {
    const [profile, scopeMap] = await Promise.all([
      this.model.findById(employeeId),
      ScopeService.getByUserId(employeeId)
    ])
    return { profile, scopeMap }
  }

  static async createEmployee(payload: z.infer<typeof UserValidation.register>["body"]) {
    const userBody = new this.model(payload);
    userBody.password = await hashString(payload.password);;
    if (userBody.avatar) userBody.avatar.private = false;
    userBody.employeeId = await this.generateEmployeeId()
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

  static async buildOrganizationTree(rootId: string, maxDepth: number = Infinity): Promise<any[]> {
    const tree = await this.model.aggregate([
      // 1. Target the root employee
      { $match: { _id: new Types.ObjectId(rootId), status: "Active" } },

      // 2. Fetch downstream employees dynamically up to the maxDepth threshold
      {
        $graphLookup: {
          from: "users", // Ensure this matches your collection name
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "reportingManager",
          as: "__internal_flat_list__", // Hidden internal name
          maxDepth: maxDepth - 1,       // 0 means immediate children only
          depthField: "level"
        }
      },

      // 3. Project only the clean metadata fields needed
      {
        $project: {
          name: 1, email: 1, designation: 1, department: 1, avatar: 1, reportingManager: 1,
          "__internal_flat_list__._id": 1,
          "__internal_flat_list__.name": 1,
          "__internal_flat_list__.email": 1,
          "__internal_flat_list__.designation": 1,
          "__internal_flat_list__.department": 1,
          "__internal_flat_list__.avatar": 1,
          "__internal_flat_list__.reportingManager": 1,
          "__internal_flat_list__.level": 1
        }
      }
    ]);

    if (!tree.length) return [];

    const root = tree[0];
    const flatList = root.__internal_flat_list__ || [];

    // 4. Map the flat records by their manager for O(N) structural lookups
    const childrenMap = new Map<string, any[]>();
    flatList.forEach((employee: any) => {
      const parentId = employee.reportingManager?.toString();
      if (parentId) {
        if (!childrenMap.has(parentId)) childrenMap.set(parentId, []);
        childrenMap.get(parentId)!.push(employee);
      }
    });

    // 5. Recursively assemble the structure using ONLY the 'children' key
    const nestChildren = (node: any) => {
      const nodeId = node._id.toString();
      const directReports = childrenMap.get(nodeId) || [];

      node.children = directReports.map(report => {
        const cleanReport = { ...report };
        delete cleanReport.level; // Remove structural helper fields
        return nestChildren(cleanReport);
      });

      return node;
    };

    const finalTree = nestChildren(root);

    // 6. Erase the temporary flat list completely so it never leaks to the client
    delete finalTree.__internal_flat_list__;

    return [finalTree];
  }

  static async getDirectReports(employeeId: string) {
    // tbd needs a little bit more than this should be recursive
    return await this.model.find({
      reportingManager: employeeId
    })
  }

  static async assignReportingManager(
    userId: string,
    proposedManagerId: string
  ): Promise<{ success: boolean; message: string }> {
    if (userId === proposedManagerId) {
      return {
        success: false,
        message: "An employee cannot be assigned to report to themselves."
      };
    }

    const checkCycles = async (currentCheckIds: string[]): Promise<boolean> => {
      const subordinates = await this.model
        .find({ reportingManager: { $in: currentCheckIds } })
        .select("_id")
        .lean();

      if (subordinates.length === 0) return false;

      const subordinateIds = subordinates.map(sub => sub._id.toString());

      if (subordinateIds.includes(proposedManagerId)) {
        return true;
      }

      return checkCycles(subordinateIds);
    };

    const willCreateCycle = await checkCycles([userId]);
    if (willCreateCycle) {
      return {
        success: false,
        message: "The selected reporting manager is down in this employee's hierarchy line. This change would create a cyclic reporting loop."
      };
    }

    await this.model.findByIdAndUpdate(userId, {
      $set: { reportingManager: proposedManagerId }
    });

    return {
      success: true,
      message: "Reporting manager updated successfully across target accounts."
    };
  }
}