const Idea = require('../models/Idea')
const User = require('../models/User')


module.exports = class IdeaController {
  static async showAll(req, res) {
    res.render('ideas/home')
  }
}