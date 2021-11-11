const PreReply = require('../PreReply');

describe('a PreReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload1 = {};
    const payload2 = {
      owner: 'konten abc',
      content: 'konten abc',
    };
    const payload3 = {
      owner: 'user-456',
      comment: 'comment-123',
    };
    const payload4 = {
      comment: 'comment-123',
      content: 'konten abc',
    };

    expect(() => new PreReply(payload1)).toThrowError('PREREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PreReply(payload2)).toThrowError('PREREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PreReply(payload3)).toThrowError('PREREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PreReply(payload4)).toThrowError('PREREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner empty', () => {
    const payload = {
      owner: '',
      comment: 'comment-123',
      content: 'konten abc',
    };

    expect(() => new PreReply(payload)).toThrowError('PREREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when comment empty', () => {
    const payload = {
      owner: 'user-456',
      comment: '',
      content: 'test anything',
    };

    expect(() => new PreReply(payload)).toThrowError('PREREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content empty', () => {
    const payload = {
      owner: 'user-456',
      comment: 'comment-123',
      content: '',
    };

    expect(() => new PreReply(payload)).toThrowError('PREREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload1 = {
      owner: 'user-456',
      comment: 'comment-123',
      content: 123,
    };
    const payload2 = {
      owner: 'user-456',
      comment: 'comment-123',
      content: [],
    };
    const payload3 = {
      owner: 'user-456',
      comment: 'comment-123',
      content: {},
    };
    const payload4 = {
      owner: 'user-456',
      comment: 'comment-123',
      content: true,
    };
    const payload5 = {
      owner: 789,
      comment: 'comment-123',
      content: 'konten aman',
    };
    const payload6 = {
      owner: 'user-456',
      comment: [123],
      content: 'konten aman',
    };

    expect(() => new PreReply(payload1)).toThrowError('PREREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreReply(payload2)).toThrowError('PREREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreReply(payload3)).toThrowError('PREREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreReply(payload4)).toThrowError('PREREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreReply(payload5)).toThrowError('PREREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PreReply(payload6)).toThrowError('PREREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create pre-reply object correctly', () => {
    const payload = {
      owner: 'user-456',
      comment: 'comment-123',
      content: 'Senang banget Dicoding bisa kasih beasiswa untuk belajar seperti ini! terlebih aku belajarnya kebanyakan secara otodidak.',
    };

    const { owner, comment, content } = new PreReply(payload);

    expect(owner).toEqual(payload.owner);
    expect(comment).toEqual(payload.comment);
    expect(content).toEqual(payload.content);
  });
});
