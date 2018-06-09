//  routes --> buildings

const express = require('express')
const router = express.Router()
const db = require('../db')
const Building = db.sequelize.models.buildings
const fs = require('fs')
const axios = require('axios')
const sequelize = require('sequelize')
const Op = sequelize.Op

router
  .get('/dots', function (req, res, next) {
    Building.findAll({
      where: {
        [Op.or]: [{
          coordinates: "None"
          }, {
          coordinates: null  
          }, {
          coordinates: "[[]]"  
          }, {
          coordinates: ""
          }
        ]
      }
    })
      .then(function (buildings) {
        res.status(200)
        res.send({
          data: buildings
        })
      })
  })
  .get('/fill', function (req, res, next) {
    Building.findAll({
      where: {
        [Op.not]: {
          [Op.or]: [{
            coordinates: "None"
          }, {
              coordinates: null
            }, {
              coordinates: "[[]]"
            }, {
              coordinates: ""
          }]
        }
      }
    })
      .then(function (buildings) {
        res.status(200)
        res.send({
        data: buildings
      })  
    })
  })
  .get('/', function (req, res, next) {
    Building.findAll()
      .then(function (buildings) {
        res.status(200)
        res.send({
          data: buildings
        })
        // Check likelihood
        // for (var i = 0; i < buildings.length; i++) {
        //   let yearBuilt = parseInt(buildings[i]["year_built"])
        //   let numUnits = parseInt(buildings[i]["num_of_res_units"])
        //   if (yearBuilt == "NaN" | numUnits == "NaN") {
        //     continue
        //   }
        //   if (numUnits < 6) {
        //     continue
        //   }
        //   if (yearBuilt >= 1974) {
        //     continue
        //   }
        //   console.log("Likely")
        // }
        next()
      })
      .catch(err => {
        console.error(err)
      })
  })


module.exports = router
