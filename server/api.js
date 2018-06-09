const api = module.exports = require('express').Router()
const buildings = require('./buildings')

api
  .use('/buildings', buildings)
  .use((req, res) => res.status(404).end()) // 404 if no matches