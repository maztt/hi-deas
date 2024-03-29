import Idea from '../models/Idea.js'
import User from '../models/User.js'
import { Op } from 'sequelize'

export class IdeaController {
    static async list (req, res) {
        const search = req.query.search === '' ? req.query.search : ''
        const order = req.query.order === 'old' ? 'ASC' : 'DESC'

        const data = await Idea.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%` }
            },
            order: [['createdAt', order]]
        })

        const ideas = data.map(result => result.get({ plain: true }))
        let ideasAmount = ideas.length
        if (ideasAmount === 0) ideasAmount = false

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

        if (!user) res.redirect('/login')

        const ideas = user.Ideas.map(result => result.dataValues)

        let userHasNoActiveIdeas = ideas.length === 0 ? true : false
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
            req.flash(
                'message',
                'You just sent your idea! Now wait for the start up investors!'
            )
            req.session.save(() => {
                res.redirect('/ideas/dashboard')
            })
        } catch (err) {
            console.error(`An error occurred: ${err}`)
        }
    }

    static async show (req, res) {
        const id = req.params.id
        
        try {
            const idea = await Idea.findOne({
                where: { id: id },
                raw: true
            })
            const user = await User.findOne({
                where: { id: idea.UserId },
                raw: true
            })
            res.render('ideas/show', { idea, user })
        } catch (err) {
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

            req.flash(
                'message',
                'You deleted the idea. Was it really that bad?'
            )
            req.session.save(() => {
                res.redirect('/ideas/dashboard')
            })
        } catch (err) {
            console.error(`An error occurred: ${err}`)
        }
    }

    static async editIdea(req, res) {
        const id = req.params.id
        const idea = await Idea.findOne({ where: { id: id }, raw: true })
        res.render('ideas/edit', { idea })
    }

    static async editIdeaPost(req, res) {
        const id = req.body.id
        const idea = {
            title: req.body.title,
            description: req.body.description
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
        } catch (err) {
            console.error(`An error occurred: ${err}`)
        }
    }
}
