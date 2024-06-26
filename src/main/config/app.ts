import express, { Router } from "express";
import { setupMiddlewares } from "@/main/config/middlewares";
import { setupRoutes } from "./routes";
const app = express();
setupMiddlewares(app);
setupRoutes(app);

export { app };
