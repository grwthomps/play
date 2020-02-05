var express = require('express');
var router = express.Router();
require('dotenv').config('/.env')
const Favorite = require('../../../lib/favorite')

const enviroment = process.env.NODE_ENV || 'development'
const config = require("../../../knexfile")[enviroment]
const database = require("knex")(config)

router.get('/', function(req, res) {
  database('favorites')
    .select()
    .then(favorites => {
      res.status(200).json(new Favorite().formatFavorites(favorites))
    })
    .catch(error => console.log(error))
})

module.exports = router;
