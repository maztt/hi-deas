const Idea = require('../models/Idea')
const User = require('../models/User')


module.exports = class IdeaController {
  static async showAll (req, res) {
    res.render('ideas/home')
  }

  static async dashboard (req, res) {
    res.render('ideas/dashboard')
  }

  static newIdea (req, res) {
    res.render('ideas/new')
  }

  static async newIdeaPost (req, res) {
    const idea = {
      title: req.body.title,
      description: req.body.description,
      UserId: req.session.userId
    }
    
    try {
      await Idea.create(idea)
  
      req.flash('message', 'You just sent your idea! Now wait for the start up investors!')
      
      req.session.save(() => {
        res.redirect('/ideas/dashboard')
      })
    } catch(err) {
      console.error(`An error occurred: ${err}`)
    }
  }
}