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
}