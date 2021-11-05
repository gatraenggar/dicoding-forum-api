class PreComment {
  constructor({ owner, thread, content }) {
    if (!owner || !thread || !content) {
      throw new Error('PRECOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof thread !== 'string' || typeof content !== 'string') {
      throw new Error('PRECOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.owner = owner;
    this.thread = thread;
    this.content = content;
  }
}

module.exports = PreComment;
