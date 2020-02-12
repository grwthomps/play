var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test post playlist favorites endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlist_favorites cascade');
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorites cascade');

    let playlist = {id: 3756, title: 'Fun Time Jamz'}
    let favorite = {id: 6523, title: 'Hakuna Matata', artistName: 'Timon & Pumba', rating: 100, genre: 'Soundtrack'}

    await database('playlists').insert(playlist)
    await database('favorites').insert(favorite)
  });

  afterEach(() => {
    database.raw('truncate table playlist_favorites cascade');
    database.raw('truncate table playlists cascade');
    database.raw('truncate table favorites cascade');
  });

  test('User can post a new playlist favorite', async () => {
    const res = await request(app)
      .post('/api/v1/playlists/3756/favorites/6523')

      expect(res.body).toEqual({"Success": "Hakuna Matata has been added to Fun Time Jamz!"})
      expect(res.status).toBe(201)
  });

  test('User cannot post a new playlist favorite with an invalid playlist id', async () => {
    const res = await request(app)
      .post('/api/v1/playlists/34860127/favorites/6523')

      expect(res.body.error_message).toEqual("Playlist not found")
      expect(res.status).toBe(404)
  });

  test('User cannot post a new playlist favorite with an invalid favorite id', async () => {
    const res = await request(app)
      .post('/api/v1/playlists/3756/favorites/9093495')

      expect(res.body.error_message).toEqual("Favorite not found")
      expect(res.status).toBe(404)
  });
  
  test('User cannot post a new playlist favorite with letters for an id', async () => {
    const res = await request(app)
      .post('/api/v1/playlists/3756/favorites/regt')

      expect(res.body.error_message).toEqual("Bad request. Ids must be a number.")
      expect(res.status).toBe(400)
  });
})
