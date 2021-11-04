const Thread = require('../../../Domains/threads/entities/PreThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

/* eslint-disable no-undef */
describe('AddThreadUseCase', () => {
  it('should throw error if use case payload not contain access token', async () => {
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Body of use case',
    };
    const useCaseAuth = {
      artifacts: { },
    };
    const addThreadUseCase = new AddThreadUseCase({});

    await expect(addThreadUseCase.execute(useCasePayload, useCaseAuth))
      .rejects
      .toThrowError('ADD_THREAD_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
  });

  it('should throw error if access token not string', async () => {
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Body of use case',
    };
    const useCaseAuth = {
      artifacts: {
        token: 123,
      },
    };
    const addThreadUseCase = new AddThreadUseCase({});

    await expect(addThreadUseCase.execute(useCasePayload, useCaseAuth))
      .rejects
      .toThrowError('ADD_THREAD_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

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
      username: 'dicoding',
      id: 'user-123',
    };
    const expectedThread = new Thread({
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
    expect(mockThreadRepository.addThread).toBeCalledWith(new Thread({
      owner: decodedAuth.id,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
    expect(thread).toStrictEqual(expectedThread);
  });
});
