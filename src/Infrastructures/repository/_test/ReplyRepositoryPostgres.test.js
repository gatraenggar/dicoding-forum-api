/* eslint-disable no-undef */
const PreReply = require('../../../Domains/replies/entities/PreReply');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist the reply correctly', async () => {
      const userId = 'user-0991747193993728';
      await UsersTableTestHelper.addUser({ id: userId, username: 'karltowns' });

      const threadId = 'thread-90891';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const commentId = 'comment-90891';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });

      const preReply = new PreReply({
        owner: userId,
        comment: commentId,
        content: 'Reply nih',
      });

      const fakeIdGenerator = () => '777';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(preReply);

      const replies = await RepliesTableTestHelper.findReplyById('reply-777');
      expect(replies).toHaveLength(1);
    });

    it('should return the reply correctly', async () => {
      const userId = 'user-097290';
      await UsersTableTestHelper.addUser({ id: userId, username: 'theantman' });

      const threadId = 'thread-5746';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const commentId = 'comment-90891';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });

      const preReply = new PreReply({
        owner: userId,
        comment: commentId,
        content: 'Reply nih',
      });

      const fakeIdGenerator = () => '777';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const reply = await replyRepositoryPostgres.addReply(preReply);

      expect(reply).toStrictEqual(new PostReply({
        id: 'reply-777',
        owner: userId,
        content: preReply.content,
      }));
    });
  });
});
