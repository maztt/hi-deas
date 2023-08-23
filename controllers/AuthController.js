import User from '../models/User.js'
import bcrypt from 'bcryptjs'

export class AuthController {

  static login (req, res) {
    res.render('auth/login')
  }

  static async loginPost (req, res) {
    const {email, password} = req.body

    const user = await User.findOne({where: {email: email}})

    if (!user) {
      req.flash('message', 'This user does not exist!')
      res.render('auth/login')

      return
    }

    const checkIfPasswordMatches = bcrypt.compareSync(password, user.password)

    if (!checkIfPasswordMatches) {
      req.flash('message', 'Password is invalid!')
      res.render('auth/login')

      return
    }

    req.session.userId = user.id

    req.session.save(() => {
      res.redirect('/')
    })
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