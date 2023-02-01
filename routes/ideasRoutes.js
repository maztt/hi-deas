const express = require('express')
const router = express.Router()
const IdeaController = require('../controllers/IdeaController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', checkAuth, IdeaController.dashboard)
router.get('/', IdeaController.showAll)

module.exports = router