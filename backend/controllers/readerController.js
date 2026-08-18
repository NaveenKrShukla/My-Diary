import Reader from '../models/Reader.js'
import { validateReaderData } from '../middleware/validation.js'

// Create reader profile
export const createReader = async (req, res, next) => {
  try {
    const validation = validateReaderData(req.body)
    if (validation.length > 0) {
      return res.status(400).json({ errors: validation })
    }
    
    const reader = new Reader({
      name: req.body.name,
      email: req.body.email || undefined,
      profilePicture: req.body.profilePicture || 'cat',
      subscribed: req.body.subscribed || false,
      subscriptionPreference: req.body.subscriptionPreference || 'instant'
    })
    
    await reader.save()
    
    res.status(201).json({
      success: true,
      message: 'Reader profile created successfully',
      data: reader
    })
  } catch (error) {
    next(error)
  }
}

// Get reader profile
export const getReaderById = async (req, res, next) => {
  try {
    const { id } = req.params
    
    const reader = await Reader.findById(id)
    
    if (!reader) {
      return res.status(404).json({ error: 'Reader not found' })
    }
    
    // Update last visit
    reader.lastVisit = new Date()
    await reader.save()
    
    res.json({
      success: true,
      data: reader
    })
  } catch (error) {
    next(error)
  }
}

// Update reader profile
export const updateReader = async (req, res, next) => {
  try {
    const { id } = req.params
    const allowedFields = ['name', 'email', 'profilePicture', 'subscribed', 'subscriptionPreference', 'annotations']
    
    const updates = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    }
    
    const reader = await Reader.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    
    if (!reader) {
      return res.status(404).json({ error: 'Reader not found' })
    }
    
    res.json({
      success: true,
      message: 'Reader profile updated successfully',
      data: reader
    })
  } catch (error) {
    next(error)
  }
}

// Get reader annotations (highlights, notes)
export const getReaderAnnotations = async (req, res, next) => {
  try {
    const { id } = req.params
    
    const reader = await Reader.findById(id).select('annotations')
    
    if (!reader) {
      return res.status(404).json({ error: 'Reader not found' })
    }
    
    res.json({
      success: true,
      data: reader.annotations || {}
    })
  } catch (error) {
    next(error)
  }
}

// Save reader annotations
export const saveReaderAnnotations = async (req, res, next) => {
  try {
    const { id } = req.params
    const { annotations } = req.body
    
    const reader = await Reader.findByIdAndUpdate(
      id,
      { annotations },
      { new: true }
    )
    
    if (!reader) {
      return res.status(404).json({ error: 'Reader not found' })
    }
    
    res.json({
      success: true,
      message: 'Annotations saved successfully',
      data: reader.annotations
    })
  } catch (error) {
    next(error)
  }
}

export default {
  createReader,
  getReaderById,
  updateReader,
  getReaderAnnotations,
  saveReaderAnnotations
}
