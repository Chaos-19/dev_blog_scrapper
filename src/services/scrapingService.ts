import path from "path";
import * as cheerio from "cheerio";
import fs from "fs";
import puppeteerExtra from "puppeteer-extra";
import dotenv from "dotenv";

import stealthPlugin from "puppeteer-extra-plugin-stealth";
import logger from "../utils/logger.js";

const puppeteer = puppeteerExtra.default; // Ensure compatibility with ESM

dotenv.config();
puppeteer.use(stealthPlugin());

export const scrape = async (url: string) => {
  try {
    const cookies = JSON.parse(`${process.env.DEV_TO_COOKIES}`);

    logger.info(`cookies data ${cookies}`);

    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: "./user-data",
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    // Set cookies before navigating
    await page.setCookie(...cookies);

    await page.goto(url, { timeout: 0 });

    await page.setViewport({ width: 2920, height: 1080 });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await new Promise((resolve) => setTimeout(resolve, 9000));
    await new Promise((resolve) => setTimeout(resolve, 9000));

    const html = await page.content();

    const body = await page.evaluate(() => {
      return document;
    });

    const blogs = await parseDevToBlogs(html);

    console.log("done: ", blogs.length);

    // fs.writeFileSync(
    //   path.join(`blogs-${new Date().toString()}.json`),
    //   JSON.stringify(blogs, null, 2)
    // );

    await browser.close();

    return blogs;
  } catch (error) {
    return [];
  }
};

export async function parseDevToBlogs(html: any) {
  const $ = cheerio.load(html);

  const blogList: {
    title: string;
    link: string;
    tags: string[];
    reactionCount: string;
    commentCount: string;
    readTime: string;
    comments: string[];
    createdAt: string;
  }[] = [];

  const body = $("body")
    .find("[data-feed-content-id]")
    .each((i: number, el: any) => {
      const title = $(el)
        .find(".crayons-story__hidden-navigation-link")
        .text()
        .trim()
        .replace(/\s+/g, " ");

      const link = $(el)
        .find(".crayons-story__hidden-navigation-link")
        .attr("href") as string;

      const blogTags: string[] = [];

      const tags = $(el)
        .find(".crayons-tag")
        .each((index: number, tag: any) => {
          blogTags.push($(tag).text().replace(/\s+/g, " ").replace("#", ""));
        });

      const reactionCount = $(el)
        .find(".aggregate_reactions_counter")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      const blogComments: string[] = [];

      const comments = $(el)
        .find(".crayons-comment__inner")
        .each((index: number, comment: any) => {
          blogComments.push($(comment).text().replace(/\s+/g, " "));
        });

      const createdAt = $(el)
        .find(".crayons-story__tertiary time")
        //.attr("datetime")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      const commentCount = $(el)
        .find("span[title='Number of comments']")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      const readTime = $(el)
        .find(".crayons-story__save")
        .text()
        .replace(/\s+/g, " ")
        .replace("read", "")
        .trim();

      blogList.push({
        title,
        link,
        tags: blogTags,
        reactionCount,
        commentCount,
        readTime,
        comments: blogComments,
        createdAt,
      });
    });

  return blogList;
}
