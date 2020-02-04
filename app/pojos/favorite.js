class Favorite {

  constructor(result) {
    console.log(result)
    this.title = result.message.body.track.track_name
    this.artistName = result.message.body.track.artist_name
    if (result.message.body.track.primary_genres.music_genre_list.length === 0) {
      this.genre = 'Unknown'
    } else {
      this.genre = result.message.body.track.primary_genres.music_genre_list[0].music_genre.music_genre_name
    }
    this.rating = result.message.body.track.track_rating
  }
}

module.exports = Favorite;
