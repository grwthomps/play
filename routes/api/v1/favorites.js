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
  if (req.query.title && req.query.artistName ){
    let track = req.query.title
    let artist = req.query.artistName
    getFavorite(track, artist)
      .then((favorite) => {
        database('favorites').insert(favorite , ['id', 'title', 'artistName', 'genre', 'rating'])
        .then((favorite) => {
          res.status(201).send(favorite[0])
        })
        .catch((error) => {
          res.status(400).json({error_message: error.message})
        })
      })
      .catch((error) => {
        res.status(400).json({error_message: error.message })
      })
  } else {
    res.status(400).json({message: 'Title and artist required'})
  }
});

module.exports = router;
