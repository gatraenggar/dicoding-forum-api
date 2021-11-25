const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('setCommentLikes function', () => {
    it('should set the comment\'s likes correctly', async () => {
      const userId = 'user-2342';
      await UsersTableTestHelper.addUser({ id: userId, username: 'gundala' });

      const threadId = 'thread-90152891';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const commentId = 'comment-6868321';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });

      const fakeIdGenerator = () => '5445';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.setCommentLikes(userId, commentId);

      const likes = await LikesTableTestHelper.findLikeById('like-5445');
      expect(likes).toHaveLength(1);
      expect(likes[0].is_liked).toEqual(true);
    });

    it('should update the existed comment\'s likes correctly', async () => {
      const userId = 'user-2342';
      await UsersTableTestHelper.addUser({ id: userId, username: 'gundala' });

      const threadId = 'thread-90152891';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const commentId = 'comment-6868321';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });

      const likeId = 'like-9183';

      await LikesTableTestHelper.addLike({
        id: likeId,
        respondent: userId,
        comment: commentId,
        is_liked: true,
      });

      const fakeIdGenerator = () => '9183';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.setCommentLikes(userId, commentId);

      const likes = await LikesTableTestHelper.findLikeById(likeId);
      expect(likes[0].is_liked).toEqual(false);
    });
  });
});
