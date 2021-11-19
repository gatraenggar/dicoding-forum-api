const PreThread = require('../../Domains/threads/entities/PreThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseAuth) {
    const { id } = useCaseAuth;

    const thread = this._threadRepository.addThread(new PreThread({
      owner: id,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));

    return thread;
  }
}

module.exports = AddThreadUseCase;
