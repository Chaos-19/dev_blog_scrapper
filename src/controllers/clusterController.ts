import { db } from "../config/db.js";
import { blogPost, clusteredPost } from "../schema/schema.js";
import { clusterService } from "../services/clusterServices.js";

import { BlogType, ClusteredPostType } from "../types/index.js";
import { Response, Request } from "express";
import logger from "../utils/logger.js";

const getClutteredPosts = async (req: Request, res: Response) => {
  
};

export const insertClusteredPosts = async (newPosts: BlogType<string>[]) => {
  if (!newPosts?.length) return;

  const allClusterEntries: ClusteredPostType[] = [];

  for (const post of newPosts) {
    const clusterEntries = clusterService.generateClustersForPost(post);
    if (clusterEntries.length) {
      allClusterEntries.push(...clusterEntries);
    }
  }

  if (allClusterEntries.length) {
    try {
      const newClusterd = await db
        .insert(clusteredPost)
        .values(
          allClusterEntries.map((cluster) => ({
            blogPostId: cluster.blogPostId,
            clusterType: cluster.clusterType,
            clusterLabel: cluster.clusterLabel,
            clusterTags: cluster.clusterTags,
            createdAt: cluster.createdAt,
            updatedAt: cluster.updatedAt,
          }))
        )
        .returning();

      logger.info(
        `Inserted ${newClusterd.length} clustered entries out of ${allClusterEntries.length}.`
      );
    } catch (error) {
      logger.error("Failed to insert clustered posts:", error);
    }
  }
};
