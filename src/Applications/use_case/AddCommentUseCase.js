const PreComment = require('../../Domains/comments/entities/PreComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseAuth, useCaseParam) {
    const { id } = useCaseAuth;

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
