const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);


const express = require('express');
const router = express.Router();

router.post('/', function(req, res) {
  if(req.body.title) {
    var info = {title: req.body.title}
    database('playlists').insert(info, ['id', 'title', 'created_at', 'updated_at'])
      .then((playlist) =>{
        var formatted_playlist = {
          id: playlist[0].id,
          title: playlist[0].title,
          createdAt: playlist[0].created_at,
          updatedAt: playlist[0].updated_at
        }
        return res.status(201).json(formatted_playlist)
      })
      .catch((error) => {
        return res.status(400).json({error: 'Title must be unique.'})
      })
  } else {
     return res.status(400).json({error: "Title required."})
  }
})

router.get('/', function(req, res) {
  database('playlists')
    .select(['id', 'title', `created_at as createdAt`, `updated_at as updatedAt`])
    .then((playlists) => {
      res.status(200).json(playlists)
    })
    .catch(error => res.status(503).json({error: error.message}))
})

module.exports = router;
