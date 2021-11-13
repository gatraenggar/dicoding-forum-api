const PreComment = require('../../Domains/comments/entities/PreComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseAuth, useCaseParam) {
    const { id } = await this._authenticationTokenManager.decodePayload(useCaseAuth.artifacts.token);

    await this._threadRepository.verifyAvailableThread(useCaseParam.threadId);

    const comment = this._commentRepository.addComment(new PreComment({
      owner: id,
      thread: useCaseParam.threadId,
      content: useCasePayload.content,
    }));

    return comment;
  }
}

module.exports = AddCommentUseCase;
