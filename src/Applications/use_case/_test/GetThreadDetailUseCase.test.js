const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadComment = require('../../../Domains/comments/entities/ThreadComment');
const CommentReply = require('../../../Domains/replies/entities/CommentReply');

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

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
    const mockCommentReplies = [
      {
        'comment-_pby2_tmXV6bcvcdev8xk': [
          new CommentReply({
            id: 'reply-BErOXUSefjwWGW1Z10Ihk',
            content: '**balasan telah dihapus**',
            date: '2021-08-08T07:59:48.766Z',
            username: 'johndoe',
          }),
          new CommentReply({
            id: 'reply-xNBtm9HPR-492AeiimpfN',
            content: 'sebuah balasan',
            date: '2021-08-08T08:07:01.522Z',
            username: 'dicoding',
          }),
        ],
        'comment-yksuCoxM2s4MMrZJO-qVD': [],
      },
    ];
    const mockThreadComments = [
      new ThreadComment({
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        replies: mockCommentReplies[0]['comment-_pby2_tmXV6bcvcdev8xk'],
      }),
      new ThreadComment({
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: '**komentar telah dihapus**',
        replies: mockCommentReplies[0]['comment-yksuCoxM2s4MMrZJO-qVD'],
      }),
    ];
    const expectedThreadDetail = new ThreadDetail({
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: mockThreadComments,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadComments));

    mockReplyRepository.getRepliesByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentReplies));

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(useCaseParam);

    expect(threadDetail).toEqual(expectedThreadDetail);

    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith(useCaseParam.threadId);

    expect(mockReplyRepository.getRepliesByCommentIds)
      .toBeCalledWith(mockThreadComments.map(({ id }) => id));

    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(useCaseParam.threadId);
  });
});
