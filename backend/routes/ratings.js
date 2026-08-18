import express from 'express'
import ratingController from '../controllers/ratingController.js'
import verifyAdmin from '../middleware/auth.js'

const router = express.Router()

router.post('/', ratingController.submitRating)
router.get('/poem/:poemId', ratingController.getPoemRatings)
router.get('/poem/:poemId/feedback', ratingController.getPoemFeedback)
router.get('/reader/:readerId', ratingController.getReaderRatings)
router.delete('/:ratingId', verifyAdmin, ratingController.deleteRating)

export default router
