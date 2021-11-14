const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const ThreadComment = require('../../Domains/comments/entities/ThreadComment');

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

    const commentsByThreadId = await this._commentRepository.getCommentsByThreadId(threadId);
    const comments = this.mapComments(commentsByThreadId);

    const commentIds = this.stringifyCommentIds(comments);
    const commentReplies = await this._replyRepository.getRepliesByCommentIds(commentIds);

    if (commentReplies.length > 0) {
      comments.forEach((comment) => {
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
      comments,
    });
  }

  mapComments(comments) {
    return comments.map(({
      id: commentId,
      username: commentatorUsername,
      created_at: commentCreatedAt,
      content,
      is_deleted,
    }) => new ThreadComment({
      id: commentId,
      username: commentatorUsername,
      date: commentCreatedAt,
      content: is_deleted ? '**komentar telah dihapus**' : content,
      replies: [],
    }));
  }

  stringifyCommentIds(comments) {
    return comments.map(({ id: commentId }) => `${commentId}`).join(', ');
  }
}

module.exports = GetThreadDetailUseCase;
