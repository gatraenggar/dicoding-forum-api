class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, authenticationTokenManager }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseAuth, useCaseParam) {
    const { id: ownerId } = useCaseAuth;
    const { threadId, commentId, replyId } = useCaseParam;

    await this._commentRepository.verifyAvailableComment(threadId, commentId);

    await this._replyRepository.verifyOwner(replyId, ownerId);

    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
