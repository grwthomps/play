const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);


const express = require('express');
const router = express.Router();

router.post('/', function(req, res) {
  if(req.body.title) {
    var info = {title: req.body.title}
    database('playlists').insert(info, ['id', 'title', `created_at as createdAt`, `updated_at as updatedAt`])
      .then((playlist) =>{
        return res.status(201).json(playlist[0])
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

router.delete('/:id', function(req,res) {
  database('playlists').where('id', req.params.id).del()
  .then((result) => {
    if (result === 1) {
      res.status(204).send();
    } else {
      res.status(404).json({error_message: 'Not Found'})
    }
  })
  .catch((error) => {
    res.status(404).json({error_message: 'Not Found'})
  })
})

module.exports = router;
