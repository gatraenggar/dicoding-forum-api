const ThreadComment = require('../../comments/entities/ThreadComment');

class ThreadDetail {
  constructor({
    id,
    title,
    body,
    date,
    username,
    comments,
  }) {
    if (
      !id
      || !title
      || !body
      || !date
      || !username
      || !comments
    ) {
      throw new Error('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || !Array.isArray(comments)
    ) {
      throw new Error('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (comments.length > 0) {
      comments.forEach((comment) => {
        if (!(comment instanceof ThreadComment)) {
          throw new Error('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
      });
    }

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }
}

module.exports = ThreadDetail;
