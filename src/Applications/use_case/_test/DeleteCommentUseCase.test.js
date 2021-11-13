const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('delete comment use case', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCaseAuth = {
      artifacts: {
        token: 'access_token',
      },
    };
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const decodedAuth = {
      username: 'johndalton',
      id: 'user-345',
    };

    const mockCommentRepository = new CommentRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(decodedAuth));

    mockCommentRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    await deleteCommentUseCase.execute(useCaseAuth, useCaseParam);

    expect(mockAuthenticationTokenManager.decodePayload)
      .toBeCalledWith(useCaseAuth.artifacts.token);

    expect(mockCommentRepository.verifyOwner)
      .toBeCalledWith({
        commentId: useCaseParam.commentId,
        ownerId: decodedAuth.id,
      });

    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith({
        commentId: useCaseParam.commentId,
        threadId: useCaseParam.threadId,
      });
  });
});
