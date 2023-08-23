import express from 'express'
import { IdeaController } from '../controllers/IdeaController.js'
import { checkAuth } from '../helpers/auth.js'

const router = express.Router()

router.get('/new', checkAuth, IdeaController.newIdea)
router.post('/new', checkAuth, IdeaController.newIdeaPost)
router.get('/edit/:id', checkAuth, IdeaController.editIdea)
router.post('/edit', checkAuth, IdeaController.editIdeaPost)
router.get('/dashboard', checkAuth, IdeaController.dashboard)
router.post('/delete', checkAuth, IdeaController.deleteIdea)
router.get('/', IdeaController.showAll)

export default router