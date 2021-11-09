/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, authenticationTokenManager }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseAuth, useCaseParam) {
    this._validateAuth(useCaseAuth.artifacts);
    const { id: ownerId } = await this._authenticationTokenManager.decodePayload(useCaseAuth.artifacts.token);
    const { threadId, commentId, replyId } = useCaseParam;

    await this._commentRepository.verifyAvailableComment(threadId, commentId);

    await this._replyRepository.verifyOwner(replyId, ownerId);

    await this._replyRepository.deleteReply(replyId);
  }

  _validateAuth(payload) {
    const { token } = payload;
    if (!token) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    }

    if (typeof token !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
