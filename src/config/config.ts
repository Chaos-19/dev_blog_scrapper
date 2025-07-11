import dotenv from "dotenv";

dotenv.config();

export default {
  // port: process.env.PORT || 3000,
  WEB_URL_TO_SCRAP: process.env.WEB_URL_TO_SCRAP,
};
