import express from "express";

const router: express.Router = express.Router()

const defaultRoutes: { path: string, route: express.Router }[] = [
  // { path: "/notification", route: notificationRoutes }
];

defaultRoutes.forEach((item) => router.use(item.path, item.route));

export default router;