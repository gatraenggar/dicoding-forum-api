/* eslint-disable no-undef */
const ThreadDetail = require('../ThreadDetail');
const ThreadComment = require('../../../comments/entities/ThreadComment');

describe('a thread detail entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload1 = {};
    const payload2 = {
      // no title prop
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        new ThreadComment({
          id: 'comment-123',
          username: 'thecommentator',
          date: '2021-08-08T08:55:09.775Z',
          content: 'cek ig kita kakaa',
          replies: [],
        }),
      ],
    };
    const payload3 = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      // no body prop
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        new ThreadComment({
          id: 'comment-123',
          username: 'thecommentator',
          date: '2021-08-08T08:55:09.775Z',
          content: 'cek ig kita kakaa',
          replies: [],
        }),
      ],
    };
    const payload4 = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      // no date prop
      username: 'dicoding',
      comments: [
        new ThreadComment({
          id: 'comment-123',
          username: 'thecommentator',
          date: '2021-08-08T08:55:09.775Z',
          content: 'cek ig kita kakaa',
          replies: [],
        }),
      ],
    };
    const payload5 = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      // no comments prop
    };

    expect(() => new ThreadDetail(payload1)).toThrowError('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadDetail(payload2)).toThrowError('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadDetail(payload3)).toThrowError('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadDetail(payload4)).toThrowError('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new ThreadDetail(payload5)).toThrowError('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when id empty', () => {
    const payload = {
      id: '',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when title empty', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: '',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when date empty', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah title',
      body: 'sebuah body thread',
      date: '',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when username empty', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah title',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: '',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload1 = {
      id: 123,
      title: 'sebuah title',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };
    const payload2 = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: {},
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };
    const payload3 = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah title',
      body: true,
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };
    const payload4 = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah title',
      body: 'sebuah body',
      date: {},
      username: 'dicoding',
      comments: [],
    };
    const payload5 = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah title',
      body: 'sebuah body',
      date: '2021-08-08T07:19:09.775Z',
      username: new Date(),
      comments: [],
    };
    const payload6 = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah title',
      body: 'sebuah body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'useeeer',
      comments: {},
    };

    expect(() => new ThreadDetail(payload1)).toThrowError('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadDetail(payload2)).toThrowError('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadDetail(payload3)).toThrowError('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadDetail(payload4)).toThrowError('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadDetail(payload5)).toThrowError('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadDetail(payload6)).toThrowError('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when comments\' element is not ThreadComment type', () => {
    const payload1 = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah title',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'useeerio',
      comments: [
        {
          id: 'comment-123',
          username: 'thecommentator',
          content: 'cek ig kita kakaa',
        },
      ],
    };
    const payload2 = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah title',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'useeerio',
      comments: [
        new Date(),
      ],
    };

    expect(() => new ThreadDetail(payload1)).toThrowError('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new ThreadDetail(payload2)).toThrowError('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should not throw error when comments is an empty array', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah title',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'useeerio',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).not.toThrow('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        new ThreadComment({
          id: 'comment-123',
          username: 'thecommentator',
          date: '2021-08-08T08:55:09.775Z',
          content: 'cek ig kita kakaa',
          replies: [],
        }),
      ],
    };

    const {
      id,
      title,
      body,
      date,
      username,
      comments,
    } = new ThreadDetail(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
