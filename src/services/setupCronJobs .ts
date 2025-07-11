import cron from "node-cron";
import { scrape } from "./scrapingService";
import config from "../config/config";
//import { insertJob } from '../controllers/jobController';

const setupCronJobs = async (croneExpression: string = "* */8 * * *") => {
  cron.schedule(croneExpression, async () => {
    try {
      console.log("Cron job started");
     

      const data = await scrape(process.env.WEB_URL_TO_SCRAP!!)
      //const result = await insertJob(data);

    
    } catch (error) {
      console.log(error);
    }
  });
};
export default setupCronJobs;
