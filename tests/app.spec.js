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
  });
  afterEach(() => {
    database.raw('truncate table favorites cascade')
  });
  test('User can post a new favorite', async () => {
    const res = await request(app)
      .post('/api/v1/favorites')
      .query({title: '5AM', artistName: 'Amber Run' });

      expect(res.status).toBe(201)
  })
})