import Theme from '../models/Theme.js'
import { validateThemeData } from '../middleware/validation.js'

// Get all themes
export const getAllThemes = async (req, res, next) => {
  try {
    const themes = await Theme.find({ isActive: true }).sort('name')
    
    res.json({
      success: true,
      data: themes
    })
  } catch (error) {
    next(error)
  }
}

// Get single theme
export const getThemeById = async (req, res, next) => {
  try {
    const { id } = req.params
    
    const theme = await Theme.findById(id)
    
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' })
    }
    
    res.json({
      success: true,
      data: theme
    })
  } catch (error) {
    next(error)
  }
}

// Create theme (admin only)
export const createTheme = async (req, res, next) => {
  try {
    const validation = validateThemeData(req.body)
    if (validation.length > 0) {
      return res.status(400).json({ errors: validation })
    }
    
    const theme = new Theme({
      name: req.body.name,
      description: req.body.description || '',
      colors: req.body.colors || {},
      typography: req.body.typography || {},
      animations: req.body.animations || {},
      preview: req.body.preview || null
    })
    
    await theme.save()
    
    res.status(201).json({
      success: true,
      message: 'Theme created successfully',
      data: theme
    })
  } catch (error) {
    next(error)
  }
}

// Update theme (admin only)
export const updateTheme = async (req, res, next) => {
  try {
    const { id } = req.params
    const allowedFields = ['name', 'description', 'colors', 'typography', 'animations', 'preview', 'isActive']
    
    const updates = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    }
    
    // Validate if name is being changed
    if (updates.name) {
      const validation = validateThemeData({ name: updates.name })
      if (validation.length > 0) {
        return res.status(400).json({ errors: validation })
      }
    }
    
    const theme = await Theme.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' })
    }
    
    res.json({
      success: true,
      message: 'Theme updated successfully',
      data: theme
    })
  } catch (error) {
    next(error)
  }
}

// Delete theme (admin only)
export const deleteTheme = async (req, res, next) => {
  try {
    const { id } = req.params
    
    const theme = await Theme.findByIdAndDelete(id)
    
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' })
    }
    
    res.json({
      success: true,
      message: 'Theme deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllThemes,
  getThemeById,
  createTheme,
  updateTheme,
  deleteTheme
}
