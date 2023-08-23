import { DataTypes } from 'sequelize'
import db from '../db/conn.js'

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  }
})

export default User