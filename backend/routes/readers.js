import express from 'express'
import readerController from '../controllers/readerController.js'
import verifyAdmin from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyAdmin, readerController.getAllReaders)
router.post('/', readerController.createReader)
router.get('/:id', readerController.getReaderById)
router.put('/:id', readerController.updateReader)
router.get('/:id/annotations', readerController.getReaderAnnotations)
router.post('/:id/annotations', readerController.saveReaderAnnotations)

export default router
