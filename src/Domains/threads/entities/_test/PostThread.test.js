const PostThread = require('../PostThread');

describe('a thread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload1 = {};
    const payload2 = {
      id: 'thread-123',
      title: 'abc',
    };
    const payload3 = {
      title: 'abc',
      owner: 'user-123',
    };
    const payload4 = {
      id: 'thread-123',
      owner: 'user-123',
    };

    expect(() => new PostThread(payload1)).toThrowError('POSTTHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostThread(payload2)).toThrowError('POSTTHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostThread(payload3)).toThrowError('POSTTHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostThread(payload4)).toThrowError('POSTTHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when id empty', () => {
    const payload = {
      id: '',
      title: 'abc',
      owner: 'user-123',
    };

    expect(() => new PostThread(payload)).toThrowError('POSTTHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when title empty', () => {
    const payload = {
      id: 'thread-123',
      title: '',
      owner: 'user-123',
    };

    expect(() => new PostThread(payload)).toThrowError('POSTTHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner empty', () => {
    const payload = {
      id: 'thread-123',
      title: 'abc',
      owner: '',
    };

    expect(() => new PostThread(payload)).toThrowError('POSTTHREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when title contains more than 50 characters', () => {
    const payload = {
      id: 'thread-123',
      owner: 'user-123',
      title: 'forumapiforumapiforumapiforumapiforumapiforumapiforumapiforumapiforumapiforumapi',
    };

    expect(() => new PostThread(payload)).toThrowError('POSTTHREAD.TITLE_LIMIT_CHAR');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload1 = {
      id: 'thread-123',
      title: 'abc',
      owner: true,
    };
    const payload2 = {
      id: 123,
      title: 'abc',
      owner: 'user-123',
    };
    const payload3 = {
      id: 'thread-123',
      title: [],
      owner: 'user-123',
    };

    expect(() => new PostThread(payload1)).toThrowError('POSTTHREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostThread(payload2)).toThrowError('POSTTHREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostThread(payload3)).toThrowError('POSTTHREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return post-thread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'abc',
      owner: 'user-123',
    };

    const { id, title, owner } = new PostThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
