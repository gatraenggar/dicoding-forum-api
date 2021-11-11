const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    if (!useCaseParam.threadId) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }
    const { threadId } = useCaseParam;

    const {
      id,
      username,
      title,
      body,
      created_at: createdAt,
    } = await this._threadRepository.getThreadById(threadId);

    const threadComments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentIds = threadComments.map(({ id: commentId }) => commentId);
    const commentReplies = await this._replyRepository.getRepliesByCommentIds(commentIds);

    if (commentReplies.length > 0) {
      threadComments.forEach((comment) => {
        // eslint-disable-next-line no-param-reassign
        comment.replies = commentReplies[0][comment.id];
      });
    }

    return new ThreadDetail({
      id,
      title,
      body,
      date: createdAt,
      username,
      comments: threadComments,
    });
  }
}

module.exports = GetThreadDetailUseCase;
