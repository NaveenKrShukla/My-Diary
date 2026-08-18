import express from 'express'
import themeController from '../controllers/themeController.js'
import verifyAdmin from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', themeController.getAllThemes)
router.get('/:id', themeController.getThemeById)

// Admin routes
router.post('/', verifyAdmin, themeController.createTheme)
router.put('/:id', verifyAdmin, themeController.updateTheme)
router.delete('/:id', verifyAdmin, themeController.deleteTheme)

export default router
