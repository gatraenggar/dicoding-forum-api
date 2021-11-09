/* eslint-disable no-undef */
const CommentReply = require('../CommentReply');

describe('a comment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload1 = {};
    const payload2 = {
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
    };
    const payload3 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
    };
    const payload4 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      content: 'sebuah comment',
    };
    const payload5 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
    };

    expect(() => new CommentReply(payload1)).toThrowError('COMMENTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new CommentReply(payload2)).toThrowError('COMMENTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new CommentReply(payload3)).toThrowError('COMMENTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new CommentReply(payload4)).toThrowError('COMMENTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new CommentReply(payload5)).toThrowError('COMMENTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content empty', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: '',
    };

    expect(() => new CommentReply(payload)).toThrowError('COMMENTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when id empty', () => {
    const payload = {
      id: '',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'Slow and steadily win the race',
    };

    expect(() => new CommentReply(payload)).toThrowError('COMMENTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when username empty', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: '',
      date: '2021-08-08T07:22:33.555Z',
      content: 'Slow and steadily win the race',
    };

    expect(() => new CommentReply(payload)).toThrowError('COMMENTREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload1 = {
      id: new Date(),
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
    };
    const payload2 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: ['johndoe'],
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
    };
    const payload3 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: 1998,
      content: 'sebuah comment',
    };
    const payload4 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: { data: 'sebuah comment' },
    };

    expect(() => new CommentReply(payload1)).toThrowError('COMMENTREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new CommentReply(payload2)).toThrowError('COMMENTREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new CommentReply(payload3)).toThrowError('COMMENTREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new CommentReply(payload4)).toThrowError('COMMENTREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
    };

    const {
      id,
      username,
      content,
      date,
    } = new CommentReply(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
  });
});
