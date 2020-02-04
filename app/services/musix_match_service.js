const fetch = require('node-fetch')
require('dotenv').config('/.env')
const Favorite = require('../pojos/favorite')

class MusixMatchService {

  static getSong(track, artist) {
    let key = process.env.MUSIXMATCH_API_KEY
    let form_artist = artist.replace(' ', '_').toLowerCase()
    let form_track = track.replace(' ', '_').toLowerCase()
    let url = `https://api.musixmatch.com/ws/1.1/matcher.track.get?apikey=${key}&q_track=${form_track}&q_artist=${form_artist}`
    console.log(url)
    return fetch(url)
    .then(response => response.json())
    .then(result => new Favorite(result))
    .then((favorite) => {
      return favorite
    })
    .catch((error) => {
      console.log(error.message)
      return { error_message: error.message}
    })
  };

}

module.exports = MusixMatchService;