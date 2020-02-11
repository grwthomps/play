# Play

## Introduction

Play is a song playlist creator that allows users to add songs as their favorites, see their favorites, and delete songs from their favorites. It also pulls song metadata automatically from the [Musixmatch API](https://developer.musixmatch.com/).

## Tech Stack

- Node.js (13.2.0)
- npm (6.13.1)
- Express (4.16.1)
- Knex (0.20.8)
- PostgreSQL (11.5)
- Jest (25.1.0)
- JavaScript

## Getting started

### Install necessary dependencies

*Note: This project is built on Express, which requires Node.js. For more information about installing Node.js, see [here](https://nodejs.org/).*

Install necessary dependencies using `npm install` from project root directory.

### Set up local database

This project uses a PostgreSQL database. Ensure you have Postgres installed (`npm install` should take care of this) and create a new database. The existing knexfile config points to a database called `play_dev` for development. However, this can easily be changed in `/knexfile.js`.

### Migrate

To migrate, run `knex migrate:latest`. The included seed file at `/db/seeds/dev/favorites.js` includes 7 songs. To seed, run `knex seed:run`

### API Keys

This project implements the [Musixmatch API](https://developer.musixmatch.com/), which requires an api key to use. [Dotenv](https://github.com/motdotla/dotenv) has been included for securely accessing these keys. To use, simply create a `.env` file in the root directory and store your keys as `key_name=key`. Keys are accessed in the code using `process.env.key_name`. Currently, our implementation uses `process.env.MUSIXMATCH_API_KEY`.

### Running a Local Server

To run locally, use `npm start` from the root directory. Requests can then be made to `localhost:3000`.

### Testing

Testing is performed with Jest. The included `package.json` file has a script for `npm test` that runs the following command: `jest --config ./jest.config.js --forceExit --coverage --runInBand`. This script can be changed in the `package.json` file in the root directory.

## Endpoints

### Favorites

#### Create a favorite:

Sample Request:
```
POST /api/v1/favorites

Request Body:

{ title: "We Will Rock You", artistName: "Queen" }
```
Sample Response:
```
{
  "id": 1,
  "title": "We Will Rock You",
  "artistName": "Queen"
  "genre": "Rock",
  "rating": 88
}
```
Invalid Responses:
```
Status: 503

{error_message: "Rating is not a number"}
```
```
Status: 400

{error_message: "Title and artist required"}
```

#### List All Favorites:

Request:
```
GET '/api/v1/favorites'
```
Sample Response:
```
[
  {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen"
    "genre": "Rock",
    "rating": 88
  },
  {
    "id": 2,
    "title": "Careless Whisper",
    "artistName": "George Michael"
    "genre": "Pop",
    "rating": 93
  },
]
```

#### Return a Single Favorite:

Request:
```
GET '/api/v1/favorites/:id'
```
Sample Response:
```
  {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen"
    "genre": "Rock",
    "rating": 88
  }
```
Invalid Response:
```
Status: 404

{error_message: "Not Found"}
```

#### Delete a Favorite:

Request:
```
DELETE '/api/v1/favorites/:id'
```
Response:
```
Status: 204
```
Invalid Response:
```
Status: 404

{error_message: "Not Found"}
```

### Playlists

#### Create a Playlist:

Sample Request:
```
POST /api/v1/playlists

Request Body:

{ title: "Workout Jamz" }
```
Sample Response:
```
{
  "id": 1,
  "title": "Workout Jamz",
  "createdAt": 2019-11-26T16:03:43+00:00,
  "updatedAt": 2019-11-26T16:03:43+00:00,
}
```
Invalid Responses:
```
Status: 400

{error_message: "Title required."}

OR

{error_message: "Title must be unique."}
```

#### List All Playlists:

Request:
```
GET /api/v1/playlists
```
Sample Response:
```
[
  {
    "id": 1,
    "title": "Cleaning House",
    "songCount": 2,
    "songAvgRating": 27.5,
    "favorites": [
                    {
                      "id": 1,
                      "title": "We Will Rock You",
                      "artistName": "Queen"
                      "genre": "Rock",
                      "rating": 25
                    },
                    {
                      "id": 4,
                      "title": "Back In Black",
                      "artistName": "AC/DC"
                      "genre": "Rock",
                      "rating": 30
                    }
                  ],
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00
  },
  {
      "id": 2,
    "title": "Running Mix",
    "songCount": 0,
    "songAvgRating": 0,
    "favorites": []
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00
  },
]

```

#### Edit a Playlist:

Sample Request:
```
PUT /api/v1/playlists/:id

Request Body:

{ title: "Party Jamz" }
```
Sample Response:
```
{
  "id": 2,
  "title": "Party Jamz",
  "createdAt": 2019-11-26T16:03:43+00:00,
  "updatedAt": 2019-11-26T16:03:43+00:00
}
```
Invalid Responses:
```
Status: 404

{error_message: "Please enter valid attributes"}

OR

{error_message: "Not Found"}
```

#### Delete a Playlist:

Request:
```
DELETE '/api/v1/playlists/:id'
```
Response:
```
Status: 204
```
Invalid Response:
```
Status: 404

{error_message: "Not Found"}
```

### Database Schema
![database](https://i.imgur.com/7IIqF5R.png)

## Project Board

[GitHub Project Board](https://github.com/grwthomps/play/projects/1)

## Core Contributors

- [Graham Thompson](https://github.com/grwthomps)
- [Mary Lang](https://github.com/mcat56)
