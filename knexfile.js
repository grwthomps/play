require('dotenv').config('/.env')

// Update with your config settings.
module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/play',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/play_test',
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }

};
