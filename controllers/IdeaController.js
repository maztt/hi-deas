const Idea = require('../models/Idea')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class IdeaController {
  static async showAll (req, res) {

    let search = ''

    if (req.query.search) {
      search = req.query.search
    }

    const ideasData = await Idea.findAll({
      include: User,
      where: {
        title: {[Op.like]: `%${search}%`}
      }
    })

    const ideas = ideasData.map(result => result.get({plain: true}))

    let ideasAmount = ideas.length

    if (ideasAmount === 0) {
      ideasAmount = false
    }

    res.render('ideas/home', { ideas, search, ideasAmount })
  }

  static async dashboard (req, res) {
    const userId = req.session.userId

    const user = await User.findOne({
      where: {
        id: userId
      },
      include: Idea,
      plain: true
    })

    if (!user) {
      res.redirect('/login')
    }

    const ideas = user.Ideas.map(result => result.dataValues)

    let userHasNoActiveIdeas = false

    if (ideas.length === 0) {
      userHasNoActiveIdeas = true
    }

    res.render('ideas/dashboard', { ideas, userHasNoActiveIdeas })
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

  static async deleteIdea (req, res) {
    const id = req.body.id
    const userId = req.session.userId

    try {
     await Idea.destroy({
      where: {
        id,
        userId
      }
    })

      req.flash('message', 'You deleted the idea. Was it really that bad?')
      req.session.save(() => {
        res.redirect('/ideas/dashboard')
      })

    } catch(err) {
      console.error(`An error occurred: ${err}`)
    }
  }


  static async editIdea (req, res) {
    const id = req.params.id

    const idea = await Idea.findOne({where: {id: id}, raw: true})

    res.render('ideas/edit', { idea })
  }

  static async editIdeaPost (req, res) {

    const id = req.body.id

    const idea = {
      title: req.body.title,
      description: req.body.description,
    }

    try {
      await Idea.update(idea, {
        where: {
          id
        }
      })
      req.flash('message', 'Idea has been edited.')
      req.session.save(() => {
        res.redirect('/ideas/dashboard')
      })
    } catch(err) {
      console.error(`An error occurred: ${err}`)
    }

    
  }
}