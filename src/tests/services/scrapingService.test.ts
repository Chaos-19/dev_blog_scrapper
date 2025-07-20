import { parseDevToBlogs } from '../../services/scrapingService.js';


describe('Scraping Service - parseDevToBlogs', () => {
  it('should parse HTML and extract blog post data correctly', async () => {
    const mockHtml = `
      <body>
        <div data-feed-content-id="1">
          <a class="crayons-story__hidden-navigation-link" href="/test-post">Test Post Title</a>
          <div class="crayons-tags">
            <a class="crayons-tag">#test</a>
            <a class="crayons-tag">#jest</a>
          </div>
          <span class="aggregate_reactions_counter">10 Reactions</span>
          <span title="Number of comments">5 comments</span>
          <div class="crayons-story__save">8 min read</div>
          <div class="crayons-story__tertiary"><time>Jul 18</time></div>
        </div>
      </body>
    `;

    const blogs = await parseDevToBlogs(mockHtml);

    expect(blogs).toHaveLength(1);
    const blog = blogs[0];
    expect(blog.title).toBe('Test Post Title');
    expect(blog.link).toBe('/test-post');
    expect(blog.tags).toEqual(['test', 'jest']);
    expect(blog.reactionCount).toBe('10 Reactions');
    expect(blog.commentCount).toBe('5 comments');
    expect(blog.readTime).toBe('8 min');
    expect(blog.createdAt).toBe('Jul 18');
  });

  it('should handle posts with missing information gracefully', async () => {
    const mockHtml = `
      <body>
        <div data-feed-content-id="2">
          <a class="crayons-story__hidden-navigation-link" href="/another-post">Another Post</a>
        </div>
      </body>
    `;

    const blogs = await parseDevToBlogs(mockHtml);

    expect(blogs).toHaveLength(1);
    const blog = blogs[0];
    expect(blog.title).toBe('Another Post');
    expect(blog.link).toBe('/another-post');
    expect(blog.tags).toEqual([]);
    expect(blog.reactionCount).toBe('');
  });
});
