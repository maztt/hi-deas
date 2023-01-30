const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Idea = db.define('Idea', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  }
})

Idea.belongsTo(User)
User.hasMany(Idea)

module.exports = Idea