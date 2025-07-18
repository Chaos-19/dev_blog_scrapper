import express, { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./utils/logger";
import { scrape } from "./services/scrapingService";
import setupCronJobs from "./services/setupCronJobs ";

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(errorHandler);
app.use((req, res, next) => {
  logger.info(`$${req.host} ${req.ip} ${req.method} ${req.path}`);
  next();
});

app.use("/", healthRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//setupCronJobs("0 */4 * * *");
setupCronJobs("0 6,14,22 * * *");
//setupCronJobs("*/20 * * * *");
//setupCronJobs("*/20 * * * *");
//scrape(process.env.WEB_URL_TO_SCRAP || "https://example.com");

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running" });
});

export default app;
