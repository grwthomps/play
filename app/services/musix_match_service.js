const fetch = require('node-fetch')
require('dotenv').config('/.env')

class MusixMatchService {

  static getSong(track, artist) {
    let key = process.env.MUSIXMATCH_API_KEY
    let form_artist = artist.replace(' ', '_').toLowerCase()
    let form_track = track.replace(' ', '_').toLowerCase()
    let url = `https://api.musixmatch.com/ws/1.1/matcher.track.get?apikey=${key}&q_track=${form_track}&q_artist=${form_artist}`
    return fetch(url)
    .then(response => response.json())
    .then((favorite) => {
      return favorite
    })
    .catch((error) => {
      return { error_message: error.message}
    })
  };

}

module.exports = MusixMatchService;
