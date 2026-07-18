import type { IUser } from "../models/user.model.ts";
import type { SCOPES_TYPES } from "./index.ts";

declare global {
  namespace Express {
    interface Request {
      grantedScopes?: SCOPES_TYPES
      user?: IUser;
      scopes?: Record<string, boolean> | null | undefined;
    }
  }
}

export { };