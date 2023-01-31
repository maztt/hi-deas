const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {

  static login (req, res) {
    res.render('auth/login')
  }

  static register (req, res) {
    res.render('auth/register')
  }

  static async registerPost (req, res) {
    const { name, email, password, confirmpassword } = req.body

    const checkIfEmailIsTaken = await User.findOne({where: {email: email}})

    if (checkIfEmailIsTaken) {
      req.flash('message', 'The e-mail is already taken, try again.')
      res.render('auth/register')

      return
    }

    if (password !== confirmpassword) {
      req.flash('message', 'Passwords are not matching, try again.')
      res.render('auth/register')

      return
    }
  }

}