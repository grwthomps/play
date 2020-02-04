var express = require('express');
var router = express.Router();

async function getFavorite(track, artist) {
  let favorite = = await MusixMatchSerivce.getSong(track,artist)
  return favorite
}

router.post('/', function(req, res) {
  if (req.query.title && req.query.artistName ){
    let track = req.query.title
    let artist = req.query.artistName
    getFavorite(track, artist)
      .then((favorite) => {
        data('favorites').insert(favorite, favorite.title)
        .then((title) => {
          res.status(201).json({message: `${title} has been added to favorites`})
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
