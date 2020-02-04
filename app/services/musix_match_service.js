const fetch = require('node-fetch')
require('dotenv').config('/.env')
const Favorite = ('../models/favorite')

class MusixMatchSerivce {

  static getSong(track, artist) {
    let key = process.env.MUSIXMATCH_API_KEY
    let url = `https://api.musixmatch.com/ws/1.1/matcher.track.get?apikey=${key}&q_track=${track}&q_artist=${artist}`
    return fetch(url)
    .then(response => response.json())
    .then(result => {
      let favorite = new Favorite(result)
      return favorite
    })
    .catch((error) => {
      return { error_message: error.message}
    })
  }

}

module.exports = MusixMatchService;
