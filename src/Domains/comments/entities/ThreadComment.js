class ThreadComment {
  constructor({
    id,
    username,
    date,
    content,
  }) {
    if (!id || !username || !date || !content) {
      throw new Error('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
    ) {
      throw new Error('THREADCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
  }
}

module.exports = ThreadComment;
