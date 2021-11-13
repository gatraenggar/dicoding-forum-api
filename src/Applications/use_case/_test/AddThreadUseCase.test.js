const PreThread = require('../../../Domains/threads/entities/PreThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Body of use case',
    };
    const useCaseAuth = {
      artifacts: {
        token: 'access_token',
      },
    };
    const decodedAuth = {
      username: 'haaland',
      id: 'user-123',
    };
    const expectedThread = new PreThread({
      owner: 'user-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockThreadRepository = new ThreadRepository();

    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(decodedAuth));

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const thread = await addThreadUseCase.execute(useCasePayload, useCaseAuth);

    // eslint-disable-next-line max-len
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCaseAuth.artifacts.token);
    expect(mockThreadRepository.addThread).toBeCalledWith(new PreThread({
      owner: decodedAuth.id,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
    expect(thread).toStrictEqual(expectedThread);
  });
});
