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

    
    // TO ENCRYPT THE PASSWORD
    const salt = bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = {
      name,
      email,
      password: hashedPassword
    }

    try {
      await User.create(user)
      req.flash('message', 'Your account has been successfully created!')
      res.redirect('/')
    } catch(err) {
      console.error(`An error occurred: ${err}`)
    }
  }


}