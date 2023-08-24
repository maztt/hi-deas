import { DataTypes } from 'sequelize'
import db from '../db/conn.js'
import User from './User.js'

const Idea = db.define('Idea', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    }
})

Idea.belongsTo(User)
User.hasMany(Idea)

export default Idea
