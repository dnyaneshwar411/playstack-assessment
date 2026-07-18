import type { PaginationOptions, PaginationQueryOptions } from "../types/index.js";
import { secureRegexInput } from "./sanitize.js";

export const buildPaginationFilters = function <T = {}, R = {}>(
  options: PaginationQueryOptions<T>
) {
  const { page, limit, query } = options;
  const pageNumber = !isNaN(Number(page)) ? parseInt(page) : 1;
  const limitNumber = !isNaN(Number(limit)) ? parseInt(limit) : 10;
  const skip = (pageNumber - 1) * limitNumber;
  return { pageNumber, limitNumber, skip, query: query && secureRegexInput(query) } as R & PaginationOptions;
}