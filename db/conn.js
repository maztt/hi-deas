const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('hi-deas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
})

try {
  sequelize.authenticate()
  console.log('Successfuly connected to the database.')
} catch (err) {
  console.error(`It was not possible to connect to the database: ${err}`)
}

module.exports = sequelize