import cron from "node-cron";
import { scrape } from "./scrapingService";
import config from "../config/config";
import logger from "../utils/logger";
import { insertBlog } from "../controllers/blogController";
import { clusterService } from "./clusterServices";
import { BlogType } from "../types";
import { insertClusteredPosts } from "../controllers/clusterController";

/**
 * Sets up cron jobs for scraping data from specified URLs.
 * @param cronExpression - The cron expression defining the schedule for the job.
 */

const setupCronJobs = async (cronExpression: string = "* */8 * * *") => {
  cron.schedule(cronExpression, async () => {
    logger.info("🕒 Cron job started");

    try {
      const urls = config.WEB_URL_TO_SCRAP?.split(",").map((url) => url.trim());

      if (!urls || urls.length === 0) {
        console.warn("⚠️ No URLs found to scrape.");
        return;
      }

      for (const url of urls) {
        const data = await scrape(url);
        const result = await insertBlog(data);
        logger.info(`✅ Scraped ${url} - Found ${data.length} items`);
        logger.info(`Inserted ${result.insertedCount} new blog posts`);

        if (result.posts && result.posts?.length > 0) {
          insertClusteredPosts(result.posts);
          logger.info(
            `Inserted clustered posts for ${result.posts.length} blogs`
          );
        }
      }
    } catch (error) {
      logger.info("❌ Cron job failed:", error);
    }
  });
};

export default setupCronJobs;
