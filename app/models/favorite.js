const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

class Favorite {

  constructor(result) {
    this.title = result.track.track_name
    this.artistName = result.track.artist_name
    this.genre = result.track.primary_genres.music_genre_list[0].music_genre.music_genre_name || 'Unknown'
    this.rating = result.track.track_rating
  }
}

module.exports = Favorite;
