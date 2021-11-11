const PostComment = require('../PostComment');

describe('a comment entity', () => {
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

    expect(() => new PostComment(payload1)).toThrowError('POSTCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostComment(payload2)).toThrowError('POSTCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostComment(payload3)).toThrowError('POSTCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostComment(payload4)).toThrowError('POSTCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content empty', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-456',
      content: '',
    };

    expect(() => new PostComment(payload)).toThrowError('POSTCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when id empty', () => {
    const payload = {
      id: '',
      owner: 'user-456',
      content: 'Slow and steadily win the race',
    };

    expect(() => new PostComment(payload)).toThrowError('POSTCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner empty', () => {
    const payload = {
      id: 'comment-123',
      owner: '',
      content: 'Slow and steadily win the race',
    };

    expect(() => new PostComment(payload)).toThrowError('POSTCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
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

    expect(() => new PostComment(payload1)).toThrowError('POSTCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostComment(payload2)).toThrowError('POSTCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostComment(payload3)).toThrowError('POSTCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-456',
      content: 'Senang banget Dicoding bisa kasih beasiswa untuk belajar seperti ini! terlebih aku belajarnya kebanyakan secara otodidak.',
    };

    const { id, owner, content } = new PostComment(payload);

    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
