import express from 'express'
import adminController from '../controllers/adminController.js'
import verifyAdmin from '../middleware/auth.js'

const router = express.Router()

router.post('/login', adminController.adminLogin)
router.post('/logout', verifyAdmin, adminController.adminLogout)
router.get('/dashboard', verifyAdmin, adminController.getDashboardStats)
router.get('/settings', verifyAdmin, adminController.getSettings)
router.put('/settings', verifyAdmin, adminController.updateSettings)

export default router
