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
        return res.status(400).json({error_message: 'Title must be unique.'})
      })
  } else {
     return res.status(400).json({error_message: "Title required."})
  }
})

router.put('/:id', function(req,res) {
  attributes = Object.keys(req.body)
  invalid = ['id', 'created_at']
  valid = ['title', 'updated_at']
  attrs = attributes.filter(attr => !invalid.includes(attr) && valid.includes(attr))
  if (attrs.length === 0) {
    return res.status(404).json({error_message: 'Please enter valid attributes'})
  }
  attrs.forEach((attribute) => {
    database('playlists').where('id', req.params.id)
    .update(attribute, req.body[attribute])
    .returning(['id', 'title', 'updated_at as updatedAt', 'created_at as createdAt'])
    .then((playlist) => {
      res.status(200).json(playlist[0])
    })
    .catch((error) => {
      res.status(404).json({error_message: 'Not Found'})
    })
  })
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
