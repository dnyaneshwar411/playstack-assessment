import express from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";

const router: express.Router = express.Router()

const defaultRoutes: { path: string, route: express.Router }[] = [
  { path: "/auth", route: authRoutes },
  { path: "/user", route: userRoutes }
];

defaultRoutes.forEach((item) => router.use(item.path, item.route));

export default router;