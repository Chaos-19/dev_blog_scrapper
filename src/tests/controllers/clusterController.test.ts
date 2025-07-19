import { insertClusteredPosts } from '../../controllers/clusterController';
import { db } from '../../config/db';
import { clusterService } from '../../services/clusterServices';
import { BlogType, ClusteredPostType } from '../../types';

jest.mock('../../config/db');
jest.mock('../../services/clusterServices');

const mockedDb = db as jest.Mocked<typeof db>;
const mockedClusterService = clusterService as jest.Mocked<typeof clusterService>;

describe('Cluster Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insertClusteredPosts', () => {
    it('should do nothing if no new posts are provided', async () => {
      await insertClusteredPosts([]);
      expect(mockedDb.query).not.toHaveBeenCalled();
    });

    it('should insert generated cluster entries into the database', async () => {
      const newPosts: BlogType<Date>[] = [
        { id: 1, title: 'Post 1', createdAt: new Date() } as any,
      ];
      const clusterEntries: ClusteredPostType[] = [{ id: 1, blogPostId: 1, clusterType: 'topic', clusterLabel: 'tech', createdAt: new Date(), updatedAt: new Date() }];
      
      (mockedClusterService.generateClustersForPost as jest.Mock).mockReturnValue(clusterEntries);

      await insertClusteredPosts(newPosts);

      expect(mockedDb.query).toHaveBeenCalledWith(expect.any(Object));
      expect(mockedDb.query).toHaveBeenCalledWith(clusterEntries);
    });

    it('should not insert if no cluster entries are generated', async () => {
        const newPosts: BlogType<Date>[] = [
            { id: 1, title: 'Post 1', createdAt: new Date() } as any,
          ];
      (mockedClusterService.generateClustersForPost as jest.Mock).mockReturnValue([]);

      await insertClusteredPosts(newPosts);

      expect(mockedDb.query).not.toHaveBeenCalled();
    });
  });
});
