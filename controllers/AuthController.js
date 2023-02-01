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
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = {
      name,
      email,
      password: hashedPassword
    }

    try {
      const createdUser = await User.create(user)

      // Auto-login
      req.session.userId = createdUser.id

      req.flash('message', 'Your account has been successfully created!')

      req.session.save(() => {
        res.redirect('/')
      })
    } catch(err) {
      console.error(`An error occurred: ${err}`)
    }
  }

  static logout (req, res) {
    req.session.destroy()
    res.redirect('/login')
  }

}