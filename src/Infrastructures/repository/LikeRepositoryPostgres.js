const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async setCommentLikes(userId, commentId) {
    const selectLikes = {
      text: 'SELECT id, is_liked FROM likes WHERE respondent = $1 AND comment = $2',
      values: [userId, commentId],
    };
    const { rows } = await this._pool.query(selectLikes);

    let setLikes = {};

    if (rows.length < 1) {
      const id = `like-${this._idGenerator()}`;

      setLikes = {
        text: 'INSERT INTO likes VALUES($1, $2, $3)',
        values: [id, userId, commentId],
      };
    } else {
      const { id, is_liked } = rows[0];

      setLikes = {
        text: 'UPDATE likes SET is_liked = NOT $1 WHERE id = $2',
        values: [is_liked, id],
      };
    }

    await this._pool.query(setLikes);
  }
}

module.exports = LikeRepositoryPostgres;
