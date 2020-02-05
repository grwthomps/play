# Play

### Introduction
  Play is a playlist is a song playlsit creator that works with the MusixMatch API. 
  Users can add songs to their favorites, see an individual or all favorites, and 
  delete songs from their favorites.
  
### Getting Started
  * Install dependencies: 
    - npm
    - knex
    - express
    - babel - jest - supertest
    - node - fetch

### Tech Stack
  * Express
  * Node
  * Jest
  
### Endpoints

#### Post a New Favorite: 
POST request to '/api/v1/favorites'
with body: 
``` 
  { title: "We Will Rock You", artistName: "Queen" }
```

Response Body: 
```
{
  "id": 1,
  "title": "We Will Rock You",
  "artistName": "Queen"
  "genre": "Rock",
  "rating": 88
}
```
with status 201



#### Get All Favorites:
GET request to '/api/v1/favorites'

Response Body:
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


#### Get a Single Favorite:
GET request to '/api/v1/favorites/:id'

Response Body: 
```
  {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen"
    "genre": "Rock",
    "rating": 88
  }
```
Unsuccessful response status 404 `Not Found`



#### Delete a Favorite: 
DELETE request to '/api/v1/favorites/:id'

Response Status: 204
Unsuccessful deletion: Response 404 `Not Found`


### Database Schema

![database](https://i.imgur.com/Mtat975.png)

### Core Contributors

Graham Thompson @grwthomps

Mary Lang @mcat56

