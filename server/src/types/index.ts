import type { SCOPES } from "../config/constants.ts";

export type PaginationQueryOptions<T = {}> = {
  query: string | undefined
  page: string
  limit: string
} & T;

export type PaginationOptions<T = {}> = {
  query: string | undefined
  pageNumber: number
  limitNumber: number
  skip: number
} & T;

export type ROLES_TYPE = "Super Admin" | "HR" | "Employee"

export type USER_STATUS_TYPE = "Active" | "In Active";

export type SCOPES_TYPES = ReadonlyArray<typeof SCOPES[number]>