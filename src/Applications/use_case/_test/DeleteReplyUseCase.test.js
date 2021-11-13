const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('delete reply use case', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCaseAuth = {
      artifacts: {
        token: 'access_token',
      },
    };
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };
    const decodedAuth = {
      username: 'nielsbohr',
      id: 'user-928',
    };

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(decodedAuth));

    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    await deleteReplyUseCase.execute(useCaseAuth, useCaseParam);

    expect(mockAuthenticationTokenManager.decodePayload)
      .toBeCalledWith(useCaseAuth.artifacts.token);

    expect(mockCommentRepository.verifyAvailableComment)
      .toBeCalledWith(useCaseParam.threadId, useCaseParam.commentId);

    expect(mockReplyRepository.verifyOwner)
      .toHaveBeenCalledWith(useCaseParam.replyId, decodedAuth.id);

    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(useCaseParam.replyId);
  });
});
