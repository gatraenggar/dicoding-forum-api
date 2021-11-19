const AddCommentUseCase = require('../AddCommentUseCase');
const PreComment = require('../../../Domains/comments/entities/PreComment');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('add comment use case', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'Try and error',
    };
    const useCaseAuth = {
      id: 'user-123',
    };
    const useCaseParam = {
      threadId: 'thread-123',
    };
    const expectedComment = new PostComment({
      id: 'comment-123',
      owner: useCaseAuth.id,
      content: useCasePayload.content,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const comment = await addCommentUseCase.execute(useCasePayload, useCaseAuth, useCaseParam);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new PreComment({
      owner: useCaseAuth.id,
      thread: useCaseParam.threadId,
      content: useCasePayload.content,
    }));
    expect(comment).toStrictEqual(expectedComment);
  });
});
