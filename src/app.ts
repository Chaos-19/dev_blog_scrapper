import express, { Application, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import healthRoutes from "./routes/health.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";
//import { scrape } from "./services/scrapingService";
import setupCronJobs from "./services/setupCronJobs.js";
import { requireAuth } from "./middleware/authenticate.js";
import userRoute from "./routes/user.js";
import BlogRouter from "./routes/blogPost.js";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app: Application = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use(helmet());
// Configure CORS middlewares
/* app.use(
  cors({
    origin: "http://localhost:300",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
); */

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  logger.info(`Request received: ${req.method} ${req.url}`);
  logger.info(`Request headers: ${JSON.stringify(req.headers)}`);
  logger.info(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

app.use(errorHandler);
app.use((req, res, next) => {
  logger.info(`$${req.host} ${req.ip} ${req.method} ${req.path}`);
  next();
});

app.use(
  "/n8n",
  createProxyMiddleware({
    target: "http://localhost:5678",
    changeOrigin: true,
    pathRewrite: {
      "^/n8n": "", // Remove /n8n prefix when forwarding
    },
  })
);
//app.use(requireAuth);

app.use("/", healthRoutes);
app.use("/api/user", userRoute);
app.use("/post", BlogRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/* app.post("/user", (req, res) => {
  res.status(201).json({ name: "Ruben" });
}); */
//setupCronJobs("*/3 * * * *");
setupCronJobs("0 6,14,22 * * *");

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running" });
});

export default app;
