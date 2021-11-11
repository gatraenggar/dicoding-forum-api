const PreComment = require('../PreComment');

describe('a comment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload1 = {};
    const payload2 = {
      owner: 'konten abc',
      content: 'konten abc',
    };
    const payload3 = {
      owner: 'user-456',
      thread: 'thread-123',
    };
    const payload4 = {
      thread: 'thread-123',
      content: 'konten abc',
    };

    expect(() => new PreComment(payload1)).toThrowError('PRECOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PreComment(payload2)).toThrowError('PRECOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PreComment(payload3)).toThrowError('PRECOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PreComment(payload4)).toThrowError('PRECOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner empty', () => {
    const payload = {
      owner: '',
      thread: 'thread-123',
      content: 'konten abc',
    };

    expect(() => new PreComment(payload)).toThrowError('PRECOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when thread empty', () => {
    const payload = {
      owner: 'user-456',
      thread: '',
      content: 'test anything',
    };

    expect(() => new PreComment(payload)).toThrowError('PRECOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content empty', () => {
    const payload = {
      owner: 'user-456',
      thread: 'thread-123',
      content: '',
    };

    expect(() => new PreComment(payload)).toThrowError('PRECOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload1 = {
      owner: 'user-456',
      thread: 'thread-123',
      content: 123,
    };
    const payload2 = {
      owner: 'user-456',
      thread: 'thread-123',
      content: [],
    };
    const payload3 = {
      owner: 'user-456',
      thread: 'thread-123',
      content: {},
    };
    const payload4 = {
      owner: 'user-456',
      thread: 'thread-123',
      content: true,
    };
    const payload5 = {
      owner: 789,
      thread: 'thread-123',
      content: 'konten aman',
    };
    const payload6 = {
      owner: 'user-456',
      thread: [123],
      content: 'konten aman',
    };

    expect(() => new PreComment(payload1)).toThrowError('PRECOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreComment(payload2)).toThrowError('PRECOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreComment(payload3)).toThrowError('PRECOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreComment(payload4)).toThrowError('PRECOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreComment(payload5)).toThrowError('PRECOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreComment(payload6)).toThrowError('PRECOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    const payload = {
      owner: 'user-456',
      thread: 'thread-123',
      content: 'Senang banget Dicoding bisa kasih beasiswa untuk belajar seperti ini! terlebih aku belajarnya kebanyakan secara otodidak.',
    };

    const { owner, thread, content } = new PreComment(payload);

    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
    expect(content).toEqual(payload.content);
  });
});
