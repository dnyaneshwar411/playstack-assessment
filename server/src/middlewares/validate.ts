import httpStatus from "http-status";
import type { NextFunction, Request, Response } from "express";
import z, { ZodObject } from "zod";
import { ApiError } from "../utils/apiError.js";
import { Types } from "mongoose";

type InferZodIssue<T extends ZodObject<any, any>> = 
  ReturnType<T['safeParse']> extends { success: false; error: { issues: Array<infer I> } } ? I : any;

export const validate = function (schemaWrapper: ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    const sources: Array<'body' | 'query' | 'params'> = ['body', 'query', 'params'];

    const config = schemaWrapper.shape;

    sources.forEach((source) => {
      const schema = config[source];

      if (schema) {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
          const sourceErrors = result.error.issues.map(
            (details: InferZodIssue<typeof schema>) =>
              `[${source}] ${details.path.join(".")}: ${details.message}`
          );
          errors.push(...sourceErrors);
        } else {
          if (source === 'query') {
            for (const key in req.query) {
              delete req.query[key];
            }
            Object.assign(req.query, result.data);
          } else {
            req[source] = result.data;
          }
        }
      }
    });

    if (errors.length > 0) {
      const errorMessage = errors.join(", ");
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    return next();
  };
};

export const paramField = (field: string) => z.object({
  params: z.object({
    [field]: z
      .string()
      .min(1, { message: "User ID is required" })
      .refine((val) => Types.ObjectId.isValid(val), {
        message: `Invalid ${field} format`,
      }),
  })
})