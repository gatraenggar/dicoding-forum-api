/* eslint-disable no-undef */
const PreComment = require('../../../Domains/comments/entities/PreComment');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ThreadRepositoryPostgres', () => {
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

  describe('deleteComment', () => {
    it('should delete comment from database', async () => {
      const ownerId = 'user-551';
      await UsersTableTestHelper.addUser({ id: ownerId, username: 'bernerslee' });

      const threadId = 'thread-2734';
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
  });
});
