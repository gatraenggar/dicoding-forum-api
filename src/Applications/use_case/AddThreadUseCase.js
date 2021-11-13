const PreThread = require('../../Domains/threads/entities/PreThread');

class AddThreadUseCase {
  constructor({ threadRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseAuth) {
    const { id } = await this._authenticationTokenManager.decodePayload(useCaseAuth.artifacts.token);

    const thread = this._threadRepository.addThread(new PreThread({
      owner: id,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));

    return thread;
  }
}

module.exports = AddThreadUseCase;
