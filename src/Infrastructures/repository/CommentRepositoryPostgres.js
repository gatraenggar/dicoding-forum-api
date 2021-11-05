/* eslint-disable no-underscore-dangle */
const PostComment = require('../../Domains/comments/entities/PostComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

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
}

module.exports = CommentRepositoryPostgres;
