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
    .select(['id', 'title', `created_at as createdAt`, `updated_at as updatedAt`]).orderBy('id')
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

router.post('/:playlistId/favorites/:favoriteId', async function(req, res) {
  if (isNaN(req.params.favoriteId) || isNaN(req.params.playlistId)) {
    return res.status(400).json({error_message: "Bad request. Ids must be a number."})
  }

  song = await database('favorites').where('id', req.params.favoriteId).first()
  playlist = await database('playlists').where('id', req.params.playlistId).first()

  if (!song) {
    return res.status(404).json({error_message: 'Favorite not found'})
  } else if (!playlist) {
    return res.status(404).json({error_message: 'Playlist not found'})
  }

  var info = {playlist_id: req.params.playlistId, favorite_id: req.params.favoriteId}
  database('playlist_favorites').insert(info)
    .then((playlistFavorite) => {
      res.status(201).json({Success: `${song.title} has been added to ${playlist.title}!`})
    })
    .catch((error) => {
      res.status(400).json({error_message: error.message})
    })
})

router.get('/:id/favorites', function(req, res) {
  database('playlists').where('id', req.params.id).first()
  .then(playlist => getPlaylistFavorites(playlist))
  .then((playlist_favorites) => {
      res.status(200).json(playlist_favorites)
  })
  .catch((error) => {
    return res.status(404).json({error_message: 'Not Found'})
  })
})


// helper methods

async function getPlaylistFavorites(playlist) {
  var info = {
    id: playlist.id,
    title: playlist.title,
    songCount: await getSongCount(playlist),
    songAvgRating: await getAvgRating(playlist),
    favorites:  await getFavorites(playlist)
  }
  return info
}

async function getFavorites(playlist) {
  let playlist_favorites = await database('playlist_favorites').where('playlist_id', playlist.id)
  let favorite_ids = playlist_favorites.map((play_fave) => {
    return play_fave.favorite_id
  })
  let favorites = await database('favorites').whereIn('id', favorite_ids).select(['id', 'title', 'artistName', 'genre', 'rating'])
  return favorites
}

async function getSongCount(playlist) {
  let playlist_favorites = await database('playlist_favorites').where('playlist_id', playlist.id)
  return playlist_favorites.length
}

async function getAvgRating(playlist) {
  let playlist_favorites = await database('playlist_favorites').where('playlist_id', playlist.id)
  let favorite_ids = playlist_favorites.map((playlist_favorite) => {
    return playlist_favorite.favorite_id
  })
  let avgRating = await database('favorites').whereIn('id', favorite_ids).avg('rating')
  let formatRating = parseFloat(parseFloat(avgRating[0].avg).toFixed(2))
  return formatRating
}

module.exports = router;
