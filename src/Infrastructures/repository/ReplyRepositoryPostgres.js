/* eslint-disable no-underscore-dangle */
const PostReply = require('../../Domains/replies/entities/PostReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply) {
    const { owner, comment, content } = reply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, owner, content',
      values: [id, owner, comment, content],
    };

    const result = await this._pool.query(query);

    return new PostReply({ ...result.rows[0] });
  }
}

module.exports = ReplyRepositoryPostgres;
