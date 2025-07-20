import { clusterService } from '../../services/clusterServices.js'  
import { BlogType } from '../../types/index.js'

describe('clusterService', () => {
  const mockPost: BlogType<Date> = {
    id: 1,
    title: 'Test Post',
    link: 'http://example.com',
    reactionCount: '100 Reactions',
    commentCount: '50 comments',
    readTime: '15 min',
    tags: ['tech', 'ai', 'development'],
    comments: [],
    createdAt: new Date(),
    scrapedAt: new Date(),
    postHash: 'some-hash',
  };

  it('should generate topic clusters from tags', () => {
    const clusters = clusterService.generateClustersForPost(mockPost);
    const topicClusters = clusters.filter(c => c.clusterType === 'topic');
    expect(topicClusters).toHaveLength(3);
    expect(topicClusters.map(c => c.clusterLabel)).toEqual(['tech', 'ai', 'development']);
  });

  it('should generate a "trending" cluster for popular posts', () => {
    const clusters = clusterService.generateClustersForPost(mockPost);
    const popularityCluster = clusters.find(c => c.clusterType === 'popularity');
    expect(popularityCluster).toBeDefined();
    expect(popularityCluster?.clusterLabel).toBe('trending');
  });

  it('should generate a "long_read" cluster for long posts', () => {
    const clusters = clusterService.generateClustersForPost(mockPost);
    const readLengthCluster = clusters.find(c => c.clusterType === 'read_length');
    expect(readLengthCluster).toBeDefined();
    expect(readLengthCluster?.clusterLabel).toBe('long_read');
  });

  it('should generate a "medium_read" cluster for medium length posts', () => {
    const mediumPost = { ...mockPost, readTime: '7 min' };
    const clusters = clusterService.generateClustersForPost(mediumPost);
    const readLengthCluster = clusters.find(c => c.clusterType === 'read_length');
    expect(readLengthCluster).toBeDefined();
    expect(readLengthCluster?.clusterLabel).toBe('medium_read');
  });

  it('should generate a "short_read" cluster for short posts', () => {
    const shortPost = { ...mockPost, readTime: '3 min' };
    const clusters = clusterService.generateClustersForPost(shortPost);
    const readLengthCluster = clusters.find(c => c.clusterType === 'read_length');
    expect(readLengthCluster).toBeDefined();
    expect(readLengthCluster?.clusterLabel).toBe('short_read');
  });

  it('should generate a "new" cluster for recent posts', () => {
    const clusters = clusterService.generateClustersForPost(mockPost);
    const recencyCluster = clusters.find(c => c.clusterType === 'recency');
    expect(recencyCluster).toBeDefined();
    expect(recencyCluster?.clusterLabel).toBe('new');
  });

  it('should not generate a "new" cluster for old posts', () => {
    const oldPost = { ...mockPost, createdAt: new Date('2023-01-01') };
    const clusters = clusterService.generateClustersForPost(oldPost);
    const recencyCluster = clusters.find(c => c.clusterType === 'recency');
    expect(recencyCluster).toBeUndefined();
  });
});
