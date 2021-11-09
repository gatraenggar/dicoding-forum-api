/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted comment', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'lincoln',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'lincoln',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title test',
          body: 'body test',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'comment now' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      const addReplyresponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: { content: 'reply now' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(addReplyresponse.payload);
      expect(addReplyresponse.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'pluto',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'pluto',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title test',
          body: 'body test',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'comment now' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      const addReplyresponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(addReplyresponse.payload);
      expect(addReplyresponse.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'bezos',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'bezos',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title test',
          body: 'body test',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'comment now' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      const addReplyresponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: { content: {} },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(addReplyresponse.payload);
      expect(addReplyresponse.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena tipe data tidak sesuai');
    });

    it('should response 404 when thread to be replied not found', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'chairulanwar',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'chairulanwar',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title test',
          body: 'body test',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'comment now' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      const addReplyresponse = await server.inject({
        method: 'POST',
        url: `/threads/xxx/comments/${addedComment.id}/replies`,
        payload: { content: 'I want to comment this one' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(addReplyresponse.payload);
      expect(addReplyresponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread atau comment tidak ditemukan');
    });

    it('should response 404 when comment to be replied not found', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'chairulanwar',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'chairulanwar',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title test',
          body: 'body test',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      const addReplyresponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/xxx/replies`,
        payload: { content: 'I want to comment this one' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(addReplyresponse.payload);
      expect(addReplyresponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread atau comment tidak ditemukan');
    });
  });
});
