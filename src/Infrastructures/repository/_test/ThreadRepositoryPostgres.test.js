/* eslint-disable no-undef */
const PreThread = require('../../../Domains/threads/entities/PreThread');
const PostThread = require('../../../Domains/threads/entities/PostThread');
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
