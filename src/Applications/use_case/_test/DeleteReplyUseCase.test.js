/* eslint-disable no-undef */
const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('delete reply use case', () => {
  it('should throw error if use case payload not contain access token', async () => {
    const useCaseAuth = {
      artifacts: {},
    };
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute(useCaseAuth, useCaseParam))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
  });

  it('should throw error if access token not string', async () => {
    const useCaseAuth = {
      artifacts: {
        token: 123,
      },
    };
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute(useCaseAuth, useCaseParam))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

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
