const ThreadComment = require('../ThreadComment');
const CommentReply = require('../../../replies/entities/CommentReply');

describe('a comment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload1 = {};
    const payload2 = {
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      replies: [],
    };
    const payload3 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      replies: [],
    };
    const payload4 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      content: 'sebuah comment',
      replies: [],
    };
    const payload5 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      replies: [],
    };
    const payload6 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
    };

    expect(() => new ThreadComment(payload1)).toThrowError('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadComment(payload2)).toThrowError('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadComment(payload3)).toThrowError('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadComment(payload4)).toThrowError('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadComment(payload5)).toThrowError('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadComment(payload6)).toThrowError('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content empty', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: '',
      replies: [],
    };

    expect(() => new ThreadComment(payload)).toThrowError('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when id empty', () => {
    const payload = {
      id: '',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'Slow and steadily win the race',
      replies: [],
    };

    expect(() => new ThreadComment(payload)).toThrowError('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when username empty', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: '',
      date: '2021-08-08T07:22:33.555Z',
      content: 'Slow and steadily win the race',
      replies: [],
    };

    expect(() => new ThreadComment(payload)).toThrowError('THREADCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload1 = {
      id: new Date(),
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      replies: [],
    };
    const payload2 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: ['johndoe'],
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      replies: [],
    };
    const payload3 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: 1998,
      content: 'sebuah comment',
      replies: [],
    };
    const payload4 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: { data: 'sebuah comment' },
      replies: [],
    };
    const payload5 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      replies: {},
    };
    const payload6 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      replies: [
        new Date(),
      ],
    };

    expect(() => new ThreadComment(payload1)).toThrowError('THREADCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadComment(payload2)).toThrowError('THREADCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadComment(payload3)).toThrowError('THREADCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadComment(payload4)).toThrowError('THREADCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadComment(payload5)).toThrowError('THREADCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadComment(payload6)).toThrowError('THREADCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      replies: [
        new CommentReply({
          id: 'reply-BErOXUSefjwWGW1Z10Ihk',
          content: '**balasan telah dihapus**',
          date: '2021-08-08T07:59:48.766Z',
          username: 'johndoe',
        }),
        new CommentReply({
          id: 'reply-xNBtm9HPR-492AeiimpfN',
          content: 'sebuah balasan',
          date: '2021-08-08T08:07:01.522Z',
          username: 'dicoding',
        }),
      ],
    };

    const {
      id,
      username,
      content,
      date,
      replies,
    } = new ThreadComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
  });
});
