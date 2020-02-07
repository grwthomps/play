const fetch = require('node-fetch')
require('dotenv').config('/.env')
const key = process.env.MUSIXMATCH_API_KEY


class MusixMatchService {

  static getSong(track, artist) {
    var form_track = MusixMatchService.formatParam(track);
    var form_artist = MusixMatchService.formatParam(artist);
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

  static formatParam(param) {
    var form_param = param.replace(' ', '_').toLowerCase()
    return form_param
  }

}

module.exports = MusixMatchService;
