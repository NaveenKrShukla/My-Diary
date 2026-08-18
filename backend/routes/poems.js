import express from 'express'
import poemController from '../controllers/poemController.js'
import verifyAdmin from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', poemController.getAllPoems)
router.get('/:id', poemController.getPoemById)
router.get('/:id/stats', poemController.getPoemStats)

// Admin routes
router.post('/', verifyAdmin, poemController.createPoem)
router.put('/:id', verifyAdmin, poemController.updatePoem)
router.delete('/:id', verifyAdmin, poemController.deletePoem)

export default router
