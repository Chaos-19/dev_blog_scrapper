import { db } from "../config/db";
import { blogPost, clusteredPost } from "../schema/schema";
import { clusterService } from "../services/clusterServices";

import { BlogType, ClusteredPostType } from "../types";
import { Response, Request } from "express";
import logger from "../utils/logger";


const getClutteredPosts = async (req: Request, res: Response) => {

}

export const insertClusteredPosts = async (newPosts: BlogType<Date>[]) => {
  if (!newPosts?.length) return;

  const allClusterEntries = [];

  for (const post of newPosts) {
    const clusterEntries = clusterService.generateClustersForPost(post);
    if (clusterEntries.length) {
      allClusterEntries.push(...clusterEntries);
    }
  }

  if (allClusterEntries.length) {
    try {
      await db.insert(clusteredPost).values(allClusterEntries);
      logger.info(`Inserted ${allClusterEntries.length} clustered entries.`);
    } catch (error) {
      logger.error("Failed to insert clustered posts:", error);
    }
  }
};


