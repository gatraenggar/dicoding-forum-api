class PostReply {
  constructor({ id, owner, content }) {
    if (!id || !owner || !content) {
      throw new Error('POSTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('POSTREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.id = id;
    this.owner = owner;
    this.content = content;
  }
}

module.exports = PostReply;
