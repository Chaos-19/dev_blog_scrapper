import express, { Application, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import healthRoutes from "./routes/health";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./utils/logger";
//import { scrape } from "./services/scrapingService";
import setupCronJobs from "./services/setupCronJobs";
import { requireAuth } from "./middleware/authenticate";

dotenv.config();

const app: Application = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use(helmet());
// Configure CORS middleware
app.use(
  cors({
    origin: "http://localhost:300",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(errorHandler);
app.use((req, res, next) => {
  logger.info(`$${req.host} ${req.ip} ${req.method} ${req.path}`);
  next();
});

//app.use(requireAuth);
app.use("/", healthRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//setupCronJobs("0 */4 * * *");
setupCronJobs("0 6,14,22 * * *");

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running" });
});

export default app;
