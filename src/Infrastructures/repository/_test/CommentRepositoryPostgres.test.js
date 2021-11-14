const PreComment = require('../../../Domains/comments/entities/PreComment');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const ThreadComment = require('../../../Domains/comments/entities/ThreadComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist the comment correctly', async () => {
      const userId = 'user-6782678';
      await UsersTableTestHelper.addUser({ id: userId, username: 'lillard' });

      const threadId = 'thread-5743';
      await ThreadsTableTestHelper.addThread({
        id: threadId, owner: userId, title: 'Thread', body: 'Thread body test',
      });

      const preComment = new PreComment({
        owner: userId,
        thread: threadId,
        content: 'Kontennya',
      });

      const fakeIdGenerator = () => '333';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(preComment);

      const comments = await CommentsTableTestHelper.findCommentById('comment-333');
      expect(comments).toHaveLength(1);
    });

    it('should return the comment correctly', async () => {
      const userId = 'user-234234';
      await UsersTableTestHelper.addUser({ id: userId, username: 'theantman' });

      const threadId = 'thread-5746';
      await ThreadsTableTestHelper.addThread({
        id: threadId, owner: userId, title: 'Thread', body: 'Thread body test',
      });

      const preComment = new PreComment({
        owner: userId,
        thread: threadId,
        content: 'Konten lagi',
      });
      const fakeIdGenerator = () => '145';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const comment = await commentRepositoryPostgres.addComment(preComment);

      expect(comment).toStrictEqual(new PostComment({
        id: 'comment-145',
        owner: userId,
        content: preComment.content,
      }));
    });
  });

  describe('verifyOwner', () => {
    it('should throw AuthorizationError when user is not the comment\'s owner', async () => {
      const notOwnerId = 'user-110';
      const ownerId = 'user-8921';
      await UsersTableTestHelper.addUser({ id: ownerId, username: 'mandela' });

      const threadId = 'thread-945';
      await ThreadsTableTestHelper.addThread({
        id: threadId, owner: ownerId, title: 'Freedom', body: 'Freedom body',
      });

      const commentId = 'comment-90991';
      await CommentsTableTestHelper.addComment({
        id: commentId, thread: threadId, owner: ownerId, content: 'Freedom content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyOwner({
        commentId,
        owner: notOwnerId,
      })).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is the comment\'s owner', async () => {
      const ownerId = 'user-774';
      await UsersTableTestHelper.addUser({ id: ownerId, username: 'Jobs' });

      const threadId = 'thread-8881';
      await ThreadsTableTestHelper.addThread({
        id: threadId, owner: ownerId, title: 'Tech', body: 'Tech body',
      });

      const commentId = 'comment-726';
      await CommentsTableTestHelper.addComment({
        id: commentId, thread: threadId, owner: ownerId, content: 'Tech content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyOwner({ commentId, ownerId }))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-87417294719740-39575')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      const userId = 'user-8931554';
      const threadId = 'thread-8908940';
      const commentId = 'comment-014901';

      await UsersTableTestHelper.addUser({
        id: userId,
        username: 'herun',
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
        title: 'Thread',
        body: 'Thread body test',
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: userId,
        thread: threadId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyAvailableComment(threadId, commentId))
        .resolves.not
        .toThrowError(NotFoundError);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should get comments by threadId from database', async () => {
      const owner = {
        id: 'user-678918921',
        username: 'alleniverson',
      };
      await UsersTableTestHelper.addUser(owner);

      const commentator1 = {
        id: 'user-189024790',
        username: 'pippen',
      };
      await UsersTableTestHelper.addUser(commentator1);

      const commentator2 = {
        id: 'user-98292947',
        username: 'rodman',
      };
      await UsersTableTestHelper.addUser(commentator2);

      const threadId = 'thread-2734';
      await ThreadsTableTestHelper.addThread({
        id: threadId, owner: owner.id, title: 'The title', body: 'The body',
      });

      const comment1 = {
        id: 'comment-98412',
        thread: threadId,
        owner: commentator1.id,
        content: 'comment 1',
        created_at: '2021-11-12T07:22:33.555Z',
        is_deleted: false,
      };
      await CommentsTableTestHelper.addComment(comment1);

      const comment2 = {
        id: 'comment-7472',
        thread: threadId,
        owner: commentator2.id,
        content: 'comment 22',
        created_at: '2021-08-08T08:45:33.555Z',
        is_deleted: true,
      };
      await CommentsTableTestHelper.addComment(comment2);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadComments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      expect(threadComments).toStrictEqual([
        {
          id: comment2.id,
          username: commentator2.username,
          content: comment2.content,
          created_at: comment2.created_at,
          is_deleted: comment2.is_deleted,
        },
        {
          id: comment1.id,
          username: commentator1.username,
          content: comment1.content,
          created_at: comment1.created_at,
          is_deleted: comment1.is_deleted,
        },
      ]);
    });
  });

  describe('deleteComment', () => {
    it('should delete comment from database', async () => {
      const ownerId = 'user-551';
      await UsersTableTestHelper.addUser({ id: ownerId, username: 'bernerslee' });

      const threadId = 'thread-09259203523958';
      await ThreadsTableTestHelper.addThread({
        id: threadId, owner: ownerId, title: 'The Webs', body: 'The webs body',
      });

      const commentId = 'comment-0148';
      await CommentsTableTestHelper.addComment({
        id: commentId, thread: threadId, owner: ownerId, content: 'The webs content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteComment({ commentId, threadId });

      const comments = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comments[0].is_deleted).toStrictEqual(true);
    });

    it('should throw NotFoundError when the comment is not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      return expect(commentRepositoryPostgres.deleteComment({
        commentId: 'lol',
        threadId: 'lol',
      }))
        .rejects
        .toThrowError(NotFoundError);
    });
  });
});
