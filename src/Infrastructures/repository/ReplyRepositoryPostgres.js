const PostReply = require('../../Domains/replies/entities/PostReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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

  async verifyOwner(replyId, ownerId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('pengguna tidak terautorisasi');
    }
  }

  async getRepliesByCommentIds(commentIds) {
    const query = {
      text: `SELECT
              replies.id,
              username,
              content,
              comment,
              TO_CHAR(
                created_at AT TIME ZONE 'Etc/GMT4', 'YYYY-MM-DD"T"HH:MI:SS.MSZ'
              ) as created_at,
              is_deleted
             FROM replies
             LEFT JOIN users
             ON replies.owner = users.id
             WHERE comment IN ($1)
             ORDER BY created_at ASC`,
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
