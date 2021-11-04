/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const Thread = require('../../Domains/threads/entities/PreThread');

class AddThreadUseCase {
  constructor({ threadRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseAuth) {
    this._validateAuth(useCaseAuth.artifacts);
    const { id } = await this._authenticationTokenManager.decodePayload(useCaseAuth.artifacts.token);

    const thread = this._threadRepository.addThread(new Thread({
      owner: id,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));

    return thread;
  }

  _validateAuth(payload) {
    const { token } = payload;
    if (!token) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    }

    if (typeof token !== 'string') {
      throw new Error('ADD_THREAD_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreadUseCase;
