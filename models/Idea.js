import { DataTypes } from 'sequelize'
import db from '../db/conn.js'
import User from './User.js'

const Idea = db.define('Idea', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
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
