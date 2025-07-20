import { clusteredPost } from  "../schema/schema.js";
import { BlogType, ClusteredPostType } from "../types/index.js"


// Define thresholds
const TRENDING_THRESHOLD = 50;
const LONG_READ_THRESHOLD = 10;
const MEDIUM_READ_THRESHOLD = 5;
const RECENT_HOURS = 24;

export const clusterService = {
  generateClustersForPost(post: BlogType<Date>): ClusteredPostType[] {
    const clusters: ClusteredPostType[] = [];

    const {
      id: blogPostId,
      tags,
      reactionCount,
      commentCount,
      readTime,
      createdAt,
      comments,
      link,
      postHash,
      scrapedAt,
      title,
    } = post;

    // 🧠 1. Topic Clusters
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        clusters.push({
          id: 0,
          blogPostId,
          clusterType: "topic",
          clusterLabel: tag.toLowerCase(),
          clusterTags: tags, // include full tag array (optional)
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }
    // 2. Popularity Clustering
    const totalEngagement = Number(
      reactionCount!!.replace("Reactions", "").trim() +
        commentCount?.replace("comments", "").trim()
    );
    if (totalEngagement >= TRENDING_THRESHOLD) {
      clusters.push({
        id: 0,
        blogPostId,
        clusterType: "popularity",
        clusterLabel: "trending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 3. Read Length Clustering
    if (Number(readTime?.replace("min", "").trim()) >= LONG_READ_THRESHOLD) {
      clusters.push({
        id:0,
        blogPostId,
        clusterType: "read_length",
        clusterLabel: "long_read",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else if (
      Number(readTime?.replace("min", "").trim()) >= MEDIUM_READ_THRESHOLD
    ) {
      clusters.push({
        id: 0,
        blogPostId,
        clusterType: "read_length",
        clusterLabel: "medium_read",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      clusters.push({
        id: 0,
        blogPostId,
        clusterType: "read_length",
        clusterLabel: "short_read",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 4. Recency Clustering
    const postAgeHours =
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (postAgeHours <= RECENT_HOURS) {
      clusters.push({
        id: 0,
        blogPostId,
        clusterType: "recency",
        clusterLabel: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return clusters;
  },
};