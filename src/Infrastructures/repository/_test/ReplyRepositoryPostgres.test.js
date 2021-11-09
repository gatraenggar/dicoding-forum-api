/* eslint-disable no-undef */
const PreReply = require('../../../Domains/replies/entities/PreReply');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const CommentReply = require('../../../Domains/replies/entities/CommentReply');
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

  describe('getRepliesByCommentIds', () => {
    it('should get replies by commentId from database', async () => {
      const owner = {
        id: 'user-3433345646',
        username: 'wiltchamberlain',
      };
      await UsersTableTestHelper.addUser(owner);

      const commentator1 = {
        id: 'user-75777554323',
        username: 'magicjohnson',
      };
      await UsersTableTestHelper.addUser(commentator1);

      const commentator2 = {
        id: 'user-2352223226555',
        username: 'shaqoneal',
      };
      await UsersTableTestHelper.addUser(commentator2);

      const threadId = 'thread-9877777';
      await ThreadsTableTestHelper.addThread({
        id: threadId, owner: owner.id, title: 'The title', body: 'The body',
      });

      const comment = {
        id: 'comment-00099881837',
        owner: owner.id,
        thread: threadId,
        content: 'comment 1',
        createdAt: '2021-11-12T07:22:33.555Z',
        is_deleted: false,
      };
      await CommentsTableTestHelper.addComment(comment);

      const reply1 = {
        id: 'reply-23462364',
        comment: comment.id,
        owner: commentator1.id,
        content: 'comment 1',
        createdAt: '2021-11-12T07:22:33.555Z',
      };
      await RepliesTableTestHelper.addReply(reply1);

      const reply2 = {
        id: 'reply-475798',
        comment: comment.id,
        owner: commentator2.id,
        content: 'comment 22',
        createdAt: '2021-08-08T08:45:33.555Z',
        is_deleted: true,
      };
      await RepliesTableTestHelper.addReply(reply2);

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const commentReplies = await replyRepositoryPostgres.getRepliesByCommentIds([comment.id]);

      expect(commentReplies).toStrictEqual([
        {
          'comment-00099881837': [
            new CommentReply({
              id: reply2.id,
              username: commentator2.username,
              date: reply2.createdAt,
              content: '**balasan telah dihapus**',
            }),
            new CommentReply({
              id: reply1.id,
              username: commentator1.username,
              date: comment.createdAt,
              content: comment.content,
            }),
          ],
        },
      ]);
    });
  });
});