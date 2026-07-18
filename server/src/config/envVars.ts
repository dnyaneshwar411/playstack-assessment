import * as zod from "zod";
import dotenv from "dotenv";

const envSchema = zod.object({
  NODE_ENV: zod.string(),
  EXPRESS_PORT: zod.coerce.number().default(1993),

  EMAIL: zod.string(),
  EMAIL_HOST: zod.string(),
  EMAIL_PORT: zod.string(),
  EMAIL_USER: zod.string(),
  EMAIL_PASSWORD: zod.string(),
  EMAIL_FROM: zod.string(),

  MONGOOSE_DB_URL: zod.string(),

  MONGOOSE_MAX_POOL_SIZE: zod.coerce.number(),
  MONGOOSE_MIN_POOL_SIZE: zod.coerce.number(),

  JWT_SECRET_TOKEN: zod.string(),
  JWT_ACCESS_EXPIRATION: zod.coerce.number(),
  JWT_REFRESH_EXPIRATION: zod.coerce.number(),
});

const validateEnv = function() {
  try {
    dotenv.config();
    return envSchema.parse(process.env);
  } catch (error) {
    process.exit(1);
  }
};

export const env = validateEnv();
