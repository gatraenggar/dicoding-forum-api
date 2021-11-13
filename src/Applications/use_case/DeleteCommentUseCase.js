class DeleteCommentUseCase {
  constructor({ commentRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseAuth, useCaseParam) {
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
}

module.exports = DeleteCommentUseCase;
