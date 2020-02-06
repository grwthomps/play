var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test playlists endpoint', () => {
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
      expect(res.body.error).toBe('Title must be unique.')
  });
})
