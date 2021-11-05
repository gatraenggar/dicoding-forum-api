/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const PreComment = require('../../Domains/comments/entities/PreComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseAuth, useCaseParam) {
    this._validateAuth(useCaseAuth.artifacts);
    const { id } = await this._authenticationTokenManager.decodePayload(useCaseAuth.artifacts.token);

    await this._threadRepository.verifyAvailableThread(useCaseParam.threadId);

    const comment = this._commentRepository.addComment(new PreComment({
      owner: id,
      thread: useCaseParam.threadId,
      content: useCasePayload.content,
    }));

    return comment;
  }

  _validateAuth(payload) {
    const { token } = payload;
    if (!token) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    }

    if (typeof token !== 'string') {
      throw new Error('ADD_COMMENT_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentUseCase;
