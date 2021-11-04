class PreThread {
  constructor({ owner, title, body }) {
    if (!owner || !title || !body) {
      throw new Error('PRETHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('PRETHREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 50) {
      throw new Error('PRETHREAD.TITLE_LIMIT_CHAR');
    }

    this.owner = owner;
    this.title = title;
    this.body = body;
  }
}

module.exports = PreThread;
