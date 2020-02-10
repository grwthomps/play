var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test post playlists endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    let playlist = {id: 3756, title: 'Fun Time Jamz'}

    await database('playlists').insert(playlist)
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade')
  });

  test('User can post a new playlist', async () => {
    const res = await request(app)
      .post('/api/v1/playlists')
      .send({title: 'Study Jamz'});

      expect(res.body).toHaveProperty('id')
      expect(res.body).toHaveProperty('title')
      expect(res.body).toHaveProperty('createdAt')
      expect(res.body).toHaveProperty('updatedAt')
      expect(res.status).toBe(201)
  });

  test('User cannot post a new playlist without title', async () => {
    const res = await request(app)
      .post('/api/v1/playlists')
      .send({title: ''});

      expect(res.status).toBe(400)
  });


  test('User cannot post a new duplicate playlist', async () => {
    const res = await request(app)
      .post('/api/v1/playlists')
      .send({title: 'Fun Time Jamz'});

      expect(res.status).toBe(400)
      expect(res.body.error_message).toBe('Title must be unique.')
  });
})

describe('Test get playlists endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    let playlist1 = {id: 238, title: 'Boogey Jamz'}
    let playlist2 = {id: 4950, title: 'Summer Time Jamz'}
    let playlist3 = {id: 5897, title: 'Winter Time Jamz'}

    await database('playlists').insert(playlist1)
    await database('playlists').insert(playlist2)
    await database('playlists').insert(playlist3)
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade')
  });

  test('User can get all playlists', async () => {
    const res = await request(app)
      .get('/api/v1/playlists')

      expect(res.body).toBeInstanceOf(Array)
      expect(res.body.length).toEqual(3)

      expect(res.body[0]).toHaveProperty('id')
      expect(res.body[0]).toHaveProperty('title')
      expect(res.body[0]).toHaveProperty('createdAt')
      expect(res.body[0]).toHaveProperty('updatedAt')

      expect(res.body[0].title).toBe('Boogey Jamz')
      expect(res.body[2].title).toBe('Winter Time Jamz')

      expect(res.status).toBe(200)
  });

  test('User can delete a playlist', async () => {
    const res = await request(app)
      .delete('/api/v1/playlists/238')

      expect(res.status).toBe(204)
  });

  test('User receives error when a playlist does not exist', async () => {
    const res = await request(app)
      .delete('/api/v1/playlists/3972')

      expect(res.status).toBe(404)
      expect(res.body.error_message).toBe('Not Found')
  });
})
describe('Test put playlists endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    let playlist = {id: 238, title: 'Boogey Jamz'}

    await database('playlists').insert(playlist)
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade')
  });

  test('User can update a playlist', async () => {
    const res = await request(app)
      .put('/api/v1/playlists/238')
      .send({title: 'Boogie Boogie'})

      expect(res.body).toHaveProperty('id')
      expect(res.body).toHaveProperty('title')
      expect(res.body).toHaveProperty('createdAt')
      expect(res.body).toHaveProperty('updatedAt')
      expect(res.body.title).toBe('Boogie Boogie')
      expect(res.status).toBe(200)
  });
  test('User cannot update a playlist without a valid id', async () => {
    const res = await request(app)
      .put('/api/v1/playlists/lp')
      .send({title: 'Boogie Boogie'})

      expect(res.status).toBe(404)
      expect(res.body.error_message).toBe('Not Found')
  });
  test('User cannot update a playlist id', async () => {
    const res = await request(app)
      .put('/api/v1/playlists/lp')
      .send({id: 'muahaha'})

      expect(res.status).toBe(404)
      expect(res.body.error_message).toBe('Please enter valid attributes')
  });
  test('User cannot update a playlist created_at', async () => {
    const res = await request(app)
      .put('/api/v1/playlists/lp')
      .send({created_at: 'hehehe'})

      expect(res.status).toBe(404)
      expect(res.body.error_message).toBe('Please enter valid attributes')
  });
  test('User cannot update a playlist for an arbitrary attribute', async () => {
    const res = await request(app)
      .put('/api/v1/playlists/lp')
      .send({mood: 'happy'})

      expect(res.status).toBe(404)
      expect(res.body.error_message).toBe('Please enter valid attributes')
  });
})
