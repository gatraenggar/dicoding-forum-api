class PreReply {
  constructor({ owner, comment, content }) {
    if (!owner || !comment || !content) {
      throw new Error('PREREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof comment !== 'string' || typeof content !== 'string') {
      throw new Error('PREREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.owner = owner;
    this.comment = comment;
    this.content = content;
  }
}

module.exports = PreReply;
