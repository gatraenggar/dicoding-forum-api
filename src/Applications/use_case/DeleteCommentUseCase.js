/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

class DeleteCommentUseCase {
  constructor({ commentRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseAuth, useCaseParam) {
    this._validateAuth(useCaseAuth.artifacts);
    const { id } = await this._authenticationTokenManager.decodePayload(useCaseAuth.artifacts.token);

    await this._commentRepository.verifyOwner({
      commentId: useCaseParam.commentId,
      ownerId: id,
    });

    await this._commentRepository.deleteComment({
      commentId: useCaseParam.commentId,
      threadId: useCaseParam.threadId,
    });
  }

  _validateAuth(payload) {
    const { token } = payload;
    if (!token) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    }

    if (typeof token !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
