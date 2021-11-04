/* eslint-disable no-undef */
const PreThread = require('../PreThread');

describe('a thread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload1 = {};
    const payload2 = {
      owner: 'user-123',
      body: 'abc',
    };
    const payload3 = {
      owner: 'user-123',
      title: 'abc',
    };
    const payload4 = {
      title: 'abc',
      body: 'abc',
    };

    expect(() => new PreThread(payload1)).toThrowError('PRETHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PreThread(payload2)).toThrowError('PRETHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PreThread(payload3)).toThrowError('PRETHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PreThread(payload4)).toThrowError('PRETHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner empty', () => {
    const payload = {
      owner: '',
      title: 'title',
      body: 'Ini body',
    };

    expect(() => new PreThread(payload)).toThrowError('PRETHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when title empty', () => {
    const payload = {
      owner: 'user-123',
      title: '',
      body: 'Ini body',
    };

    expect(() => new PreThread(payload)).toThrowError('PRETHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when body empty', () => {
    const payload = {
      owner: 'user-123',
      title: 'Title',
      body: '',
    };

    expect(() => new PreThread(payload)).toThrowError('PRETHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload1 = {
      owner: 'user-123',
      title: 123,
      body: 'body blabla',
    };
    const payload2 = {
      owner: 'user-123',
      title: 'Title',
      body: true,
    };
    const payload3 = {
      owner: [],
      title: 'Title',
      body: 'body abc',
    };

    expect(() => new PreThread(payload1)).toThrowError('PRETHREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreThread(payload2)).toThrowError('PRETHREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreThread(payload3)).toThrowError('PRETHREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 50 characters', () => {
    const payload = {
      owner: 'user-123',
      title: 'forumapiforumapiforumapiforumapiforumapiforumapiforumapiforumapiforumapiforumapi',
      body: 'Ini body',
    };

    expect(() => new PreThread(payload)).toThrowError('PRETHREAD.TITLE_LIMIT_CHAR');
  });

  it('should create thread object correctly', () => {
    const payload = {
      owner: 'user-123',
      title: 'Correct Title',
      body: 'Correct body of thread',
    };

    const { owner, title, body } = new PreThread(payload);

    expect(owner).toEqual(payload.owner);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
