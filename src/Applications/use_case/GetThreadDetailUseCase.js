/* eslint-disable no-param-reassign */
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const ThreadComment = require('../../Domains/comments/entities/ThreadComment');
const CommentReply = require('../../Domains/replies/entities/CommentReply');

class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
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

    const commentIds = comments.map(({ id: commentId }) => commentId);

    const likesByCommentId = await this._likeRepository.countCommentLikes(commentIds);
    const likes = this.mapLikes(likesByCommentId);

    comments.forEach((comment) => {
      comment.likeCount = likes[comment.id];
    });

    const repliesByCommentIds = await this._replyRepository.getRepliesByCommentIds(commentIds.join(', '));
    const replies = this.mapReplies(repliesByCommentIds);

    comments.forEach((comment) => {
      comment.replies = replies[comment.id] ? replies[comment.id] : [];
    });

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
      likeCount: 0,
      replies: [],
    }));
  }

  mapLikes(likes) {
    const likesMap = {};

    likes.forEach(({ comment: commentId, count }) => {
      likesMap[commentId] = count;
    });

    return likesMap;
  }

  mapReplies(replies) {
    const repliesMap = {};

    if (replies.length > 0) {
      replies.forEach(({
        id,
        username,
        content,
        is_deleted,
        comment: commentId,
        created_at: date,
      }) => {
        if (!repliesMap[commentId]) repliesMap[commentId] = [];

        repliesMap[commentId].push(
          new CommentReply({
            id,
            username,
            date,
            content: is_deleted ? '**balasan telah dihapus**' : content,
          }),
        );
      });
    }
    return repliesMap;
  }
}

module.exports = GetThreadDetailUseCase;
