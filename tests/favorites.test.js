const request = require('supertest')
const app = require('../app')

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Favorites Endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');
    let favorites = [
      {
        id: 34,
        title: 'Shake It Off',
        artistName: 'Taylor Swift',
        rating: 90,
        genre: 'Pop'
      },
      {
        id: 52,
        title: 'Poetic Justice',
        artistName: 'Kendrick Lamar',
        rating: 85,
        genre: 'Rap'
      }
    ]

    await database('favorites').insert(favorites)
  });

  afterEach(() => {
    database.raw('truncate table favorites cascade')
  });

  it('should list all favorites', async () => {
    const res = await request(app)
      .get('/api/v1/favorites')

    expect(res.statusCode).toEqual(200)

    expect(res.body.length).toEqual(2)

    expect(res.body[0]).toHaveProperty('id')
    expect(res.body[0]).toHaveProperty('title')
    expect(res.body[0]).toHaveProperty('artistName')
    expect(res.body[0]).toHaveProperty('rating')
    expect(res.body[0]).toHaveProperty('genre')

    expect(res.body[0].title).toEqual('Shake It Off')
    expect(res.body[1].title).toEqual('Poetic Justice')
  });
})
