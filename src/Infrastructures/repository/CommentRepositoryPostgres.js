/* eslint-disable no-underscore-dangle */
const PostComment = require('../../Domains/comments/entities/PostComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { owner, thread, content } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, owner, content',
      values: [id, owner, thread, content],
    };

    const result = await this._pool.query(query);

    return new PostComment({ ...result.rows[0] });
  }

  async verifyOwner({ commentId, ownerId }) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread atau comment tidak ditemukan');
    }

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('pengguna tidak terautorisasi');
    }
  }

  async deleteComment({ commentId, threadId }) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND thread = $2',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread atau comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
