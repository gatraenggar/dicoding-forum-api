/* eslint-disable no-undef */
/* eslint-disable no-multiple-empty-lines */
const AddCommentUseCase = require('../AddCommentUseCase');
const PreComment = require('../../../Domains/comments/entities/PreComment');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('add comment use case', () => {
  it('should throw error if use case payload not contain access token', async () => {
    const useCasePayload = {
      content: 'Try and error',
    };
    const useCaseAuth = {
      artifacts: {},
    };
    const useCaseParam = {
      threadId: 'thread-123',
    };

    const addCommentUseCase = new AddCommentUseCase({});

    await expect(addCommentUseCase.execute(useCasePayload, useCaseAuth, useCaseParam))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
  });

  it('should throw error if access token not string', async () => {
    const useCasePayload = {
      content: 'Try and error',
    };
    const useCaseAuth = {
      artifacts: {
        token: 123,
      },
    };
    const useCaseParam = {
      threadId: 'thread-123',
    };

    const addCommentUseCase = new AddCommentUseCase({});

    await expect(addCommentUseCase.execute(useCasePayload, useCaseAuth, useCaseParam))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'Try and error',
    };
    const useCaseAuth = {
      artifacts: {
        token: 'access_token',
      },
    };
    const useCaseParam = {
      threadId: 'thread-123',
    };
    const decodedAuth = {
      username: 'oredoo',
      id: 'user-345',
    };
    const expectedComment = new PostComment({
      id: 'comment-123',
      owner: decodedAuth.id,
      content: useCasePayload.content,
    });

    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(decodedAuth));

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const comment = await addCommentUseCase.execute(useCasePayload, useCaseAuth, useCaseParam);

    // eslint-disable-next-line max-len
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCaseAuth.artifacts.token);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new PreComment({
      owner: decodedAuth.id,
      thread: useCaseParam.threadId,
      content: useCasePayload.content,
    }));
    expect(comment).toStrictEqual(expectedComment);
  });
});
