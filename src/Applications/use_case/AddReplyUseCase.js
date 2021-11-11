const PreReply = require('../../Domains/replies/entities/PreReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseAuth, useCaseParam) {
    this._validateAuth(useCaseAuth.artifacts);
    const { id } = await this._authenticationTokenManager.decodePayload(useCaseAuth.artifacts.token);

    await this._commentRepository.verifyAvailableComment(useCaseParam.threadId, useCaseParam.commentId);

    return this._replyRepository.addReply(new PreReply({
      owner: id,
      comment: useCaseParam.commentId,
      content: useCasePayload.content,
    }));
  }

  _validateAuth(payload) {
    const { token } = payload;
    if (!token) {
      throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    }

    if (typeof token !== 'string') {
      throw new Error('ADD_REPLY_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReplyUseCase;
