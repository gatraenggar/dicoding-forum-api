const PostThread = require('../../Domains/threads/entities/PostThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { owner, title, body } = thread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, owner, title',
      values: [id, owner, title, body],
    };

    const result = await this._pool.query(query);

    return new PostThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('tidak dapat membuat comment baru karena thread tidak ditemukan');
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id, username, title, body, created_at
             FROM threads
             JOIN users ON threads.owner = users.id
             WHERE threads.id = $1`,
      values: [threadId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return {
      ...result.rows[0],
      created_at: new Date(new Date(result.rows[0].created_at)
        .setHours(result.rows[0].created_at.getHours() + 8))
        .toISOString(),
    };
  }
}

module.exports = ThreadRepositoryPostgres;
