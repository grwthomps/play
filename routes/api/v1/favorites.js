const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
require('dotenv').config('/.env')


const express = require('express');
const router = express.Router();
const MusixMatchService = require('../../../app/services/musix_match_service')

async function getFavorite(track, artist) {
  let favorite = await MusixMatchService.getSong(track,artist)
  return favorite
}

router.post('/', function(req, res) {
  if (req.body.title && req.body.artistName ){
    let track = req.body.title
    let artist = req.body.artistName
    getFavorite(track, artist)
      .then((favorite) => {
        if (isNaN(favorite.message.body.track.track_rating)) {
          return res.status(503).send({error_message: 'Rating is not a number'})
        }
        if (favorite.message.body.track.primary_genres.music_genre_list.length === 0) {
          var genre = 'Unknown'
        } else {
          var genre = favorite.message.body.track.primary_genres.music_genre_list[0].music_genre.music_genre_name
        }
        var info = {
                title: favorite.message.body.track.track_name,
                artistName: favorite.message.body.track.artist_name,
                genre: genre,
                rating: favorite.message.body.track.track_rating  }
        database('favorites').insert(info , ['id', 'title', 'artistName', 'genre', 'rating'])
        .then((favorite) => {
          return res.status(201).send(favorite[0])
        })
        .catch((error) => {
          return res.status(400).json({error_message: error.message})
        })
      })
      .catch((error) => {
        return res.status(400).json({error_message: error.message })
      })
  } else {
    return res.status(400).json({message: 'Title and artist required'})
  }
});


router.delete('/:id', function(req,res) {
  database('favorites').where('id', req.params.id).del()
  .then(() => {
    res.status(204).send();
  })
  .catch((error) => {
    res.status(404).json({error_message: 'Not Found'})
  })
})

module.exports = router;
