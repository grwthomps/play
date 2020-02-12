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
    await database.raw('truncate table playlist_favorites cascade');
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorites cascade');

    let playlist1 = {id: 238, title: 'Boogey Jamz'}
    let playlist2 = {id: 4950, title: 'Summer Time Jamz'}
    let playlist3 = {id: 5897, title: 'Winter Time Jamz'}
    let favorite1 = {id: 9234, title: 'Alive', artistName: 'Dabin', rating: 75, genre: 'edm'}
    let favorite2 = {id: 86465, title: 'Time', artistName: 'Kidswaste', rating: 90, genre: 'alternative'}
    let favorite3 = {id: 7365992, title: 'Breathe', artistName: 'Telepopmusik', rating: 80, genre: 'down tempo'}
    let playlist_favorite1 = { playlist_id: 238, favorite_id: 9234}
    let playlist_favorite2 = { playlist_id: 238, favorite_id: 86465}
    let playlist_favorite3 = { playlist_id: 4950, favorite_id: 86465}
    let playlist_favorite4 = { playlist_id: 4950, favorite_id: 7365992}


    await database('playlists').insert(playlist1)
    await database('playlists').insert(playlist2)
    await database('playlists').insert(playlist3)
    await database('favorites').insert(favorite1)
    await database('favorites').insert(favorite2)
    await database('favorites').insert(favorite3)
    await database('playlist_favorites').insert(playlist_favorite1)
    await database('playlist_favorites').insert(playlist_favorite2)
    await database('playlist_favorites').insert(playlist_favorite3)
    await database('playlist_favorites').insert(playlist_favorite4)
  });

  afterEach(() => {
    database.raw('truncate table playlist_favorites cascade');
    database.raw('truncate table playlists cascade');
    database.raw('truncate table favorites cascade');
  });

  test('User can get all playlists with their favorites', async () => {
    const res = await request(app)
      .get('/api/v1/playlists')

      expect(res.body).toBeInstanceOf(Array)
      expect(res.body.length).toEqual(3)

      expect(res.body[0]).toHaveProperty('id')
      expect(res.body[0]).toHaveProperty('title')
      expect(res.body[0]).toHaveProperty('songCount')
      expect(res.body[0]).toHaveProperty('songAvgRating')
      expect(res.body[0]).toHaveProperty('favorites')
      expect(res.body[0]).toHaveProperty('createdAt')
      expect(res.body[0]).toHaveProperty('updatedAt')
      expect(res.body[0]).toHaveProperty('favorites')
      expect(res.body[0].favorites.length).toBe(2)
      expect(res.body[1].favorites.length).toBe(2)
      expect(res.body[2].favorites.length).toBe(0)

      expect(res.body[0].title).toBe('Boogey Jamz')
      expect(res.body[2].title).toBe('Winter Time Jamz')

      expect(res.body[0].favorites[0].title).toBe('Alive')
      expect(res.body[0].favorites[1].title).toBe('Time')

      expect(res.body[1].favorites[0].title).toBe('Time')
      expect(res.body[1].favorites[1].title).toBe('Breathe')

      expect(res.status).toBe(200)
  });

  test('User can delete a playlist', async () => {
    const res = await request(app)
      .delete('/api/v1/playlists/5897')

      expect(res.status).toBe(204)
  });
  test('User can delete a playlist with favorites', async () => {
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
