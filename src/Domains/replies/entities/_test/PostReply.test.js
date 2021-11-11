const PostReply = require('../PostReply');

describe('a PostReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload1 = {};
    const payload2 = {
      id: 'comment-123',
      content: 'we need \'content\' prop, not \'message\' prop!',
    };
    const payload3 = {
      id: 'comment-123',
      owner: 'user-456',
    };
    const payload4 = {
      owner: 'user-456',
      content: 'we need \'content\' prop, not \'message\' prop!',
    };

    expect(() => new PostReply(payload1)).toThrowError('POSTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostReply(payload2)).toThrowError('POSTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostReply(payload3)).toThrowError('POSTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostReply(payload4)).toThrowError('POSTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content empty', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-456',
      content: '',
    };

    expect(() => new PostReply(payload)).toThrowError('POSTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when id empty', () => {
    const payload = {
      id: '',
      owner: 'user-456',
      content: 'Slow and steadily win the race',
    };

    expect(() => new PostReply(payload)).toThrowError('POSTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner empty', () => {
    const payload = {
      id: 'comment-123',
      owner: '',
      content: 'Slow and steadily win the race',
    };

    expect(() => new PostReply(payload)).toThrowError('POSTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload1 = {
      id: ['comment-123'],
      owner: 'user-456',
      content: 'Slow and steadily win the race',
    };
    const payload2 = {
      id: 'comment-123',
      owner: true,
      content: 'Slow and steadily win the race',
    };
    const payload3 = {
      id: 'comment-123',
      owner: 'user-456',
      content: { msg: 'Slow and steadily win the race' },
    };

    expect(() => new PostReply(payload1)).toThrowError('POSTREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostReply(payload2)).toThrowError('POSTREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostReply(payload3)).toThrowError('POSTREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-456',
      content: 'Senang banget Dicoding bisa kasih beasiswa untuk belajar seperti ini! terlebih aku belajarnya kebanyakan secara otodidak.',
    };

    const { id, owner, content } = new PostReply(payload);

    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
