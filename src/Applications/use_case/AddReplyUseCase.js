const PreReply = require('../../Domains/replies/entities/PreReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseAuth, useCaseParam) {
    const { id } = await this._authenticationTokenManager.decodePayload(useCaseAuth.artifacts.token);

    await this._commentRepository.verifyAvailableComment(useCaseParam.threadId, useCaseParam.commentId);

    return this._replyRepository.addReply(new PreReply({
      owner: id,
      comment: useCaseParam.commentId,
      content: useCasePayload.content,
    }));
  }
}

module.exports = AddReplyUseCase;
