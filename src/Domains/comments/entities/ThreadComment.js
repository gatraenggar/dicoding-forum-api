const CommentReply = require('../../replies/entities/CommentReply');

class ThreadComment {
  constructor({
    id,
    username,
    date,
    content,
    likeCount,
    replies,
  }) {
    if (!id || !username || !date || !content || !replies) {
      throw new Error('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
      || typeof likeCount !== 'number'
      || !Array.isArray(replies)
    ) {
      throw new Error('THREADCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (replies.length > 0) {
      replies.forEach((reply) => {
        if (!(reply instanceof CommentReply)) {
          throw new Error('THREADCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
      });
    }

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.likeCount = likeCount;
    this.replies = replies;
  }
}

module.exports = ThreadComment;
