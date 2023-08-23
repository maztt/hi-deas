import Sequelize from 'sequelize'

const sequelize = new Sequelize('hi-deas', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
})

try {
  sequelize.authenticate()
  console.log('Successfuly connected to the database.')
} catch (err) {
  console.error(`It was not possible to connect to the database: ${err}`)
}

export default sequelize