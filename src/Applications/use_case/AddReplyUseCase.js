const PreReply = require('../../Domains/replies/entities/PreReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, useCaseAuth, useCaseParam) {
    const { id } = useCaseAuth;

    await this._commentRepository.verifyAvailableComment(useCaseParam.threadId, useCaseParam.commentId);

    return this._replyRepository.addReply(new PreReply({
      owner: id,
      comment: useCaseParam.commentId,
      content: useCasePayload.content,
    }));
  }
}

module.exports = AddReplyUseCase;
