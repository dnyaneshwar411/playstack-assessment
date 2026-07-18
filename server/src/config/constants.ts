import type { ROLES_TYPE, USER_STATUS_TYPE } from "../types/index.js"

export const ROLES: ROLES_TYPE[] = ["Super Admin", "HR", "Employee"] as const;

export const SCOPES = [
  "user:read:own",
  "user:read:all",
  "user:create:all",
  "user:update:own",
  "user:update:all",
  "user:delete:all",

  "role:assign:basic",
  "role:assign:admin",
  "manager:assign:all"
] as const;

export const ROLE_SCOPES_MAPPING: Record<ROLES_TYPE, ReadonlyArray<typeof SCOPES[number]>> = {
  "Super Admin": [
    "user:read:own", "user:read:all",
    "user:create:all", "user:update:own", "user:update:all", "user:delete:all",
    "role:assign:basic", "role:assign:admin", "manager:assign:all"
  ],

  "HR": [
    "user:read:own", "user:read:all",
    "user:create:all", "user:update:own", "user:update:all",
    "role:assign:basic"
  ],

  "Employee": [
    "user:read:own", "user:update:own"
  ]
} as const;


export const USER_STATUSES: USER_STATUS_TYPE[] = ["Active", "In Active"];