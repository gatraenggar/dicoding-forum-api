/* eslint-disable no-undef */
const PreComment = require('../../../Domains/comments/entities/PreComment');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');

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
