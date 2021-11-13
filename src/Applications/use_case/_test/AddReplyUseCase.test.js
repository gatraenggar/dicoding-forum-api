const AddReplyUseCase = require('../AddReplyUseCase');
const PreReply = require('../../../Domains/replies/entities/PreReply');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('add reply use case', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'Try and error',
    };
    const useCaseAuth = {
      artifacts: {
        token: 'access_token',
      },
    };
    const useCaseParam = {
      threadId: 'thread123',
      commentId: 'comment-123',
    };
    const decodedAuth = {
      username: 'oredoo',
      id: 'user-345',
    };
    const expectedReply = new PostReply({
      id: 'comment-123',
      owner: decodedAuth.id,
      content: useCasePayload.content,
    });

    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(decodedAuth));

    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReply));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const comment = await addReplyUseCase.execute(useCasePayload, useCaseAuth, useCaseParam);

    // eslint-disable-next-line max-len
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCaseAuth.artifacts.token);
    expect(mockCommentRepository.verifyAvailableComment)
      .toBeCalledWith(useCaseParam.threadId, useCaseParam.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new PreReply({
      owner: decodedAuth.id,
      comment: useCaseParam.commentId,
      content: useCasePayload.content,
    }));
    expect(comment).toStrictEqual(expectedReply);
  });
});
