import cron from "node-cron";
import { scrape } from "./scrapingService.js";
import config from "../config/config.js";
import logger from "../utils/logger.js";
import { insertBlog } from "../controllers/blogController.js";
import { clusterService } from "./clusterServices.js";
//import { BlogType } from "../types.js";
import { insertClusteredPosts } from "../controllers/clusterController.js";

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
          await insertClusteredPosts(result.posts);
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
