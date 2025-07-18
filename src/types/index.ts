export type BlogType<T extends string | Date = string> = {
  id: number;
  title: string;
  link: string;
  reactionCount: string | null;
  commentCount: string | null;
  readTime: string | null;
  tags: string[] | null;
  comments: string[] | null;
  scrapedAt: Date;
  createdAt: T;
  postHash: string;
};

export type ClusteredPostType = {
  id: number;
  blogPostId: number;
  clusterType: "topic" | "popularity" | "read_length" | "recency";
  clusterLabel: string;
  clusterTags?: string[]; // Optional, if multi-label in one
  createdAt: Date;
  updatedAt: Date;
};
