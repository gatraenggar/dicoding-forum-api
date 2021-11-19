class DeleteCommentUseCase {
  constructor({ commentRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseAuth, useCaseParam) {
    const { id } = useCaseAuth;

    await this._commentRepository.verifyOwner({
      commentId: useCaseParam.commentId,
      ownerId: id,
    });

    await this._commentRepository.deleteComment({
      commentId: useCaseParam.commentId,
      threadId: useCaseParam.threadId,
    });
  }
}

module.exports = DeleteCommentUseCase;
