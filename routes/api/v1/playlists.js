const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
require('dotenv').config('/.env')


const express = require('express');
const router = express.Router();
