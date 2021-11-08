/* eslint-disable no-undef */
const PreThread = require('../../../Domains/threads/entities/PreThread');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-9929929929')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-70910', username: 'tolle' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-8908940', owner: 'user-70910', title: 'Thread', body: 'Thread body test',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-8908940')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should persist the thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'tester' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      const userId = await userRepositoryPostgres.getIdByUsername('tester');

      const preThread = new PreThread({
        owner: userId,
        title: 'The Title',
        body: 'The body of thread',
      });

      const fakeIdGenerator = () => '321';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(preThread);

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-321');
      expect(threads).toHaveLength(1);
    });

    it('should return the thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-12345', username: 'tester2' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      const userId = await userRepositoryPostgres.getIdByUsername('tester');

      const preThread = new PreThread({
        owner: userId,
        title: 'The Title',
        body: 'The body of thread',
      });
      const fakeIdGenerator = () => '999';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const thread = await threadRepositoryPostgres.addThread(preThread);

      expect(thread).toStrictEqual(new PostThread({
        id: 'thread-999',
        owner: userId,
        title: preThread.title,
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return thread detail correctly', async () => {
      const user = { id: 'user-12814', username: 'descartes' };
      await UsersTableTestHelper.addUser(user);

      const thread = {
        id: 'thread-9781927891',
        owner: user.id,
        title: 'cogito ergo sum',
        body: 'I think, therefore I exist',
        created_at: '2021-08-08T07:19:09.775Z',
      };
      await ThreadsTableTestHelper.addThread(thread);

      const fakeIdGenerator = () => '321';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadDetail = await threadRepositoryPostgres.getThreadById(thread.id);

      expect(threadDetail).toStrictEqual({
        id: thread.id,
        username: user.username,
        title: thread.title,
        body: thread.body,
        created_at: thread.created_at,
      });
    });

    it('should throw NotFoundError when threadId is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      return expect(threadRepositoryPostgres.getThreadById('lol'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });
});
