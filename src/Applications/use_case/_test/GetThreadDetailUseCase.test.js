const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadComment = require('../../../Domains/comments/entities/ThreadComment');
const CommentReply = require('../../../Domains/replies/entities/CommentReply');

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('get thread detail use case', () => {
  it('should throw error if there is no use case param', async () => {
    const useCaseParam = {};

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: ThreadRepository,
      commentRepository: CommentRepository,
    });

    await expect(getThreadDetailUseCase.execute(useCaseParam))
      .rejects
      .toThrowError('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID');
  });

  it('should orchestrating the get thread detail action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
    };
    const mockThread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };
    const mockThreadComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        created_at: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        likeCount: 2,
        is_deleted: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        created_at: '2021-08-08T07:26:21.338Z',
        content: '**komentar telah dihapus**',
        likeCount: 1,
        is_deleted: true,
      },
    ];
    const mockCommentReplies = [
      {
        id: 'reply-xNBtm9HPR-492AeiimpfN',
        comment: mockThreadComments[1].id,
        username: 'dicoding',
        content: 'sebuah balasan',
        created_at: '2021-08-08T07:59:48.766Z',
        is_deleted: false,
      },
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihk',
        comment: mockThreadComments[1].id,
        username: 'johndoe',
        content: '**balasan telah dihapus**',
        created_at: '2021-08-08T08:07:01.522Z',
        is_deleted: true,
      },
    ];
    const expectedThreadDetail = new ThreadDetail({
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        new ThreadComment({
          id: mockThreadComments[0].id,
          username: mockThreadComments[0].username,
          date: mockThreadComments[0].created_at,
          content: mockThreadComments[0].content,
          likeCount: mockThreadComments[0].likeCount,
          replies: [],
        }),
        new ThreadComment({
          id: mockThreadComments[1].id,
          username: mockThreadComments[1].username,
          date: mockThreadComments[1].created_at,
          content: mockThreadComments[1].content,
          likeCount: mockThreadComments[1].likeCount,
          replies: [
            new CommentReply({
              id: mockCommentReplies[0].id,
              username: mockCommentReplies[0].username,
              date: mockCommentReplies[0].created_at,
              content: mockCommentReplies[0].content,
            }),
            new CommentReply({
              id: mockCommentReplies[1].id,
              username: mockCommentReplies[1].username,
              date: mockCommentReplies[1].created_at,
              content: mockCommentReplies[1].content,
            }),
          ],
        }),
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadComments));

    mockLikeRepository.countCommentLikes = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          comment: mockThreadComments[0].id,
          count: mockThreadComments[0].likeCount,
        },
        {
          comment: mockThreadComments[1].id,
          count: mockThreadComments[1].likeCount,
        },
      ]));

    mockReplyRepository.getRepliesByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentReplies));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(useCaseParam);

    expect(threadDetail).toEqual(expectedThreadDetail);

    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(useCaseParam.threadId);

    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith(useCaseParam.threadId);

    expect(mockLikeRepository.countCommentLikes)
      .toBeCalledWith(mockThreadComments.map(({ id }) => id));

    expect(mockReplyRepository.getRepliesByCommentIds)
      .toBeCalledWith(mockThreadComments.map(({ id }) => id).join(', '));
  });
});
