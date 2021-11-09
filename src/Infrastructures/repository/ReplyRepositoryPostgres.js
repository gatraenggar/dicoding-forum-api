/* eslint-disable no-underscore-dangle */
const PostReply = require('../../Domains/replies/entities/PostReply');
const CommentReply = require('../../Domains/replies/entities/CommentReply');
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
    const idString = commentIds.map((id) => `${id}`).join(', ');

    const query = {
      text: `SELECT replies.id, username, content, comment, created_at, is_deleted
             FROM replies
             LEFT JOIN users
             ON replies.owner = users.id
             WHERE comment IN ($1)
             ORDER BY created_at ASC`,
      values: [idString],
    };

    const result = await this._pool.query(query);
    const replies = [];

    if (result.rows.length > 0) {
      replies.push({});

      result.rows.forEach(({ comment: commentId }) => {
        if (!replies[0][commentId]) {
          replies[0][commentId] = [];
        }
      });

      result.rows.forEach(({
        id,
        username,
        content,
        comment: commentId,
        created_at: createdAt,
        is_deleted: isDeleted,
      }) => {
        replies[0][commentId].push(
          new CommentReply({
            id,
            username,
            content: isDeleted ? '**balasan telah dihapus**' : content,
            date: new Date(new Date(createdAt).setHours(createdAt.getHours() + 8)).toISOString(),
          }),
        );
      });
    }

    return replies;
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
