/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
class ReplyRepository {
  async addReply(reply) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByCommentIds(commentIds) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;
