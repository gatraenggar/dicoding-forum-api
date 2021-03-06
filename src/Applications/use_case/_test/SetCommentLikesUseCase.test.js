const SetCommentLikesUseCase = require('../SetCommentLikesUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('set comment\'s likes use case', () => {
  it('should orchestrating the set comment\'s likes action correctly', async () => {
    const useCaseAuth = {
      id: 'user-123',
    };
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-234',
    };

    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeRepository.setCommentLikes = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const setCommentLikesUseCase = new SetCommentLikesUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await setCommentLikesUseCase.execute(useCaseAuth, useCaseParam);

    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCaseParam.threadId, useCaseParam.commentId);
    expect(mockLikeRepository.setCommentLikes).toBeCalledWith(useCaseAuth.id, useCaseParam.commentId);
  });
});
