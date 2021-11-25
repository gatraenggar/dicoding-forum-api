exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    respondent: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_liked: {
      type: 'BOOLEAN',
      notNull: true,
      default: true,
    },
  });

  pgm.addConstraint('likes', 'fk_likes.respondent_users.id', 'FOREIGN KEY(respondent) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('likes', 'fk_likes.comment_comments.id', 'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'fk_likes.respondent_users.id');
  pgm.dropConstraint('likes', 'fk_likes.comment_comments.id');

  pgm.dropTable('likes');
};
