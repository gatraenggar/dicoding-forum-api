const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('delete reply use case', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCaseAuth = {
      id: 'user-928',
    };
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteReplyUseCase.execute(useCaseAuth, useCaseParam);

    expect(mockCommentRepository.verifyAvailableComment)
      .toBeCalledWith(useCaseParam.threadId, useCaseParam.commentId);

    expect(mockReplyRepository.verifyOwner)
      .toHaveBeenCalledWith(useCaseParam.replyId, useCaseAuth.id);

    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(useCaseParam.replyId);
  });
});
