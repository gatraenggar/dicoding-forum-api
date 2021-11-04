class PostThread {
  constructor({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new Error('POSTTHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('POSTTHREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 50) {
      throw new Error('POSTTHREAD.TITLE_LIMIT_CHAR');
    }

    this.id = id;
    this.title = title;
    this.owner = owner;
  }
}

module.exports = PostThread;
