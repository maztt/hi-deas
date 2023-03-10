const express = require('express')
const router = express.Router()
const IdeaController = require('../controllers/IdeaController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/new', checkAuth, IdeaController.newIdea)
router.post('/new', checkAuth, IdeaController.newIdeaPost)
router.get('/edit/:id', checkAuth, IdeaController.editIdea)
router.post('/edit', checkAuth, IdeaController.editIdeaPost)
router.get('/dashboard', checkAuth, IdeaController.dashboard)
router.post('/delete', checkAuth, IdeaController.deleteIdea)
router.get('/', IdeaController.showAll)

module.exports = router