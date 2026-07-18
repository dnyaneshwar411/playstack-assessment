import { z } from "zod"
import { ROLES, SCOPES, USER_STATUSES } from "../config/constants.js";

export default class UserValidation {
  private static objectIdRegex = /^[0-9a-fA-F]{24}$/;
  private static zObjectId = z.string().regex(this.objectIdRegex, "Invalid database identifier");

  private static avatarSchema = z.object({
    private: z.boolean().default(false),
    key: z.string({ message: "Avatar storage key is required" }).trim().min(1)
  });

  static paramMongoObjectId = (field: string) => {
    return z.object({
      params: z.object({
        [field]: z.string().regex(this.objectIdRegex, "Invalid target employee ID format")
      })
    })
  }

  static register = z.object({
    body: z.object({

      name: z.string().trim().min(1, "Name cannot be empty").optional(),

      email: z
        .string({ message: "Email is required" })
        .trim()
        .email("Invalid email address"),

      mobileNumber: z
        .number()
        .int()
        .positive("Mobile number must be a valid positive integer")
        .optional(),

      password: z
        .string({ message: "Password is required" })
        .trim()
        .min(6, "Password must be at least 6 characters long"),

      employeeId: z.string().trim().optional(),

      reportingManager: this.zObjectId.optional(),

      role: z.enum(ROLES).default("Employee"),

      department: z.string(),

      designation: z.string().trim().optional(),

      salary: z.number().positive("Salary must be a positive number").optional(),

      status: z.enum(USER_STATUSES).default("Active"),

      joiningDate: z.coerce.date().default(() => new Date()),

      avatar: this.avatarSchema.optional()
    })
  });

  static update = z.object({
    params: z.object({
      employeeId: z.string().regex(this.objectIdRegex, "Invalid target employee ID format")
    }),
    body: this.register.shape.body.partial().extend({
      password: z.never("You cannot update the password!").optional(),
    }),
  })

  static delete = z.object({
    params: z.object({
      employeeId: z.string().regex(this.objectIdRegex, "Invalid target employee ID format")
    })
  })

  static assignReportingManager = z.object({
    params: z.object({
      "userId": z.string().regex(this.objectIdRegex, "Invalid target employee ID format")
    }),
    body: z.object({
      reportingManager: z.string().regex(this.objectIdRegex, "Invalid target employee ID format")
    })
  })

  static updateScopes = z.object({
    params: z.object({
      "userId": z.string().regex(this.objectIdRegex, "Invalid target employee ID format")
    }),
    body: z.object({
      scopeMap: z.object(
        SCOPES.reduce((acc, scope) => {
          acc[scope] = z.boolean().optional();
          return acc;
        }, {} as Record<string, z.ZodOptional<z.ZodBoolean>>)
      )
    })
  })

  static organizationTree = z.object({
    query: z.object({
      depth: z.coerce.number().max(20).min(1).default(1),
      node: z.string().regex(this.objectIdRegex, "Invalid database identifier")
    })
  })
}