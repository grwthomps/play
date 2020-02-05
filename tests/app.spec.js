var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test the root path', () => {
  test('It should respond to the GET method', async () => {
    const res = await request(app)
      .get("/");

    expect(res.statusCode).toBe(200);
  });
});

describe('Test favorites endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');
    let favorite = {id: 1, title: 'Alive', artistName: 'Dabin', rating: 75, genre: 'edm'}

    await database('favorites').insert(favorite)
    fetch.resetMocks();
  });
  afterEach(() => {
    database.raw('truncate table favorites cascade')
  });
  test('User can post a new favorite', async () => {
    await fetch.mockResponseOnce(
     JSON.stringify({
       message: { body:  { track: {
                                   artist_name: "Amber Run",
                                   track_name: "5AM",
                                   track_rating: 88,
                                   primary_genres: {
                                     music_genre_list: [{
                                       music_genre: {
                                         music_genre_name:  "Alternative" }}]}}}}}))

    const res = await request(app)
      .post('/api/v1/favorites')
      .send({title: '5AM', artistName: 'Amber Run' });

      expect(fetch.mock.calls.length).toEqual(1);
      expect(res.body).toHaveProperty('id')
      expect(res.body).toHaveProperty('title')
      expect(res.body).toHaveProperty('artistName')
      expect(res.body).toHaveProperty('genre')
      expect(res.body).toHaveProperty('rating')
      expect(res.status).toBe(201)
  });
  test('User cannot post a new favorite without title and artist name', async () => {
    await fetch.mockResponseOnce(
     JSON.stringify({
       message: { body:  { track: {
                                   artist_name: "Amber Run",
                                   track_name: "5AM",
                                   track_rating: 88,
                                   primary_genres: {
                                     music_genre_list: [{
                                       music_genre: {
                                         music_genre_name:  "Alternative" }}]}}}}}))


    const res = await request(app)
      .post('/api/v1/favorites')
      .send({title: '5AM' });

      expect(res.body.message).toBe('Title and artist required')
      expect(res.status).toBe(400)
  });
  test('User cannot post a new favorite when rating is not a number', async () => {
    await fetch.mockResponseOnce(
     JSON.stringify({
       message: { body:  { track: {
                                   artist_name: "Amber Run",
                                   track_name: "5AM",
                                   track_rating: "Uh oh",
                                   primary_genres: {
                                     music_genre_list: [{
                                       music_genre: {
                                         music_genre_name:  "Alternative" }}]}}}}}))

    const res = await request(app)
      .post('/api/v1/favorites')
      .send({title: '5AM', artistName: 'Amber Run' });

      expect(fetch.mock.calls.length).toEqual(1);
      expect(res.status).toBe(503)
      expect(res.body.error_message).toBe('Rating is not a number')
  });
  test('User can delete a favorite', async () => {
    const res = await request(app)
      .delete('/api/v1/favorites/1')

      expect(res.status).toBe(204)
  });
});
