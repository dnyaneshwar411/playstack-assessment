import jwt from "jsonwebtoken"
import { env } from "../config/envVars.js"

export default class TokenService {
  static async validateToken<T>(token: string) {
    const payload = jwt.verify(token, env.JWT_SECRET_TOKEN)
    return payload as T
  };

  static async createToken(payload: Record<string, any>) {
    const token = jwt.sign(payload, env.JWT_SECRET_TOKEN);
    return token;
  };
}