var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.query.title && req.query.artistName ){
    let track = req.query.title
    let artist = req.query.artistName
    async function getFavorite = await MusixMatchSerivce.getSong(track,artist)

  }









  res.send('respond with a resource');
});

module.exports = router;
