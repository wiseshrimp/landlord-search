const debug = require('debug')('sql')
const chalk = require('chalk')
const Sequelize = require('sequelize')
const Promise = require('bluebird')
const { Client } = require('pg')
const dbName = 'landlord-dev'

let sequelize
const BOROUGHS = ['Brooklyn', 'Queens', 'Manhattan', 'Bronx', 'Staten Island']

if (process.env.HEROKU_POSTGRESQL_COBALT_URL) {
  sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_COBALT_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: true
  })
} else {
  sequelize = new Sequelize(`postgres://localhost:5432/${dbName}`, {
    logging: debug,
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: false
    }
  })
}

const Building = sequelize.define('buildings', {
  building_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  building_number: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  street_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  borough: {
    type: Sequelize.ENUM(...BOROUGHS),
    allowNull: false
  }, 
  zip_code: Sequelize.STRING,
  num_of_res_units: Sequelize.INTEGER,
  city_council_district: Sequelize.INTEGER,
  latitude: Sequelize.STRING,
  longitude: Sequelize.STRING,
  block_number: Sequelize.INTEGER,
  lot_number: Sequelize.INTEGER,
  year_built: Sequelize.STRING,
  num_of_complaints: Sequelize.INTEGER,
  num_of_dob_violations: Sequelize.INTEGER,
  num_of_ecb_violations: Sequelize.INTEGER,
  complaints_link: Sequelize.STRING,
  dob_violations_link: Sequelize.STRING,
  ecb_violations_link: Sequelize.STRING,
  landlord_name: Sequelize.STRING,
  coordinates: Sequelize.TEXT,
  height_roof: Sequelize.STRING
})

Building.sync()

const db = global.db = {
  Sequelize,
  sequelize
}

module.exports = db
