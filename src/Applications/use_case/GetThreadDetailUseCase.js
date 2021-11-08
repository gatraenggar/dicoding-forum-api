/* eslint-disable space-before-blocks */
/* eslint-disable no-underscore-dangle */
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam) {
    if (!useCaseParam.threadId){
      throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }

    const { threadId } = useCaseParam;
    const threadComments = await this._commentRepository.getCommentsByThreadId(threadId);

    const {
      id,
      username,
      title,
      body,
      created_at: createdAt,
    } = await this._threadRepository.getThreadById(threadId);

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
