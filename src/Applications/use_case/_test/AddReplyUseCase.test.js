const AddReplyUseCase = require('../AddReplyUseCase');
const PreReply = require('../../../Domains/replies/entities/PreReply');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('add reply use case', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'Try and error',
    };
    const useCaseAuth = {
      id: 'user-345',
    };
    const useCaseParam = {
      threadId: 'thread123',
      commentId: 'comment-123',
    };
    const expectedReply = new PostReply({
      id: 'comment-123',
      owner: useCaseAuth.id,
      content: useCasePayload.content,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReply));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    const comment = await addReplyUseCase.execute(useCasePayload, useCaseAuth, useCaseParam);

    expect(mockCommentRepository.verifyAvailableComment)
      .toBeCalledWith(useCaseParam.threadId, useCaseParam.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new PreReply({
      owner: useCaseAuth.id,
      comment: useCaseParam.commentId,
      content: useCasePayload.content,
    }));
    expect(comment).toStrictEqual(expectedReply);
  });
});
