const Idea = require('../models/Idea')
const User = require('../models/User')


module.exports = class IdeaController {
  static async showAll (req, res) {
    res.render('ideas/home')
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
}