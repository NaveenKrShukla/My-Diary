import Admin from '../models/Admin.js'
import Poem from '../models/Poem.js'
import Reader from '../models/Reader.js'
import Rating from '../models/Rating.js'
import Subscription from '../models/Subscription.js'
import { generateToken } from '../middleware/auth.js'
import { validateLoginData } from '../middleware/validation.js'

// Admin login
export const adminLogin = async (req, res, next) => {
  try {
    const validation = validateLoginData(req.body)
    if (validation.length > 0) {
      return res.status(400).json({ errors: validation })
    }
    
    const { username, password } = req.body
    
    // Find admin with password (select: false by default)
    const admin = await Admin.findOne({ username }).select('+passwordHash')
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Compare password
    const isMatch = await admin.comparePassword(password)
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Update last login
    admin.lastLogin = new Date()
    await admin.save()
    
    // Generate token
    const token = generateToken(admin._id, admin.username)
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    })
  } catch (error) {
    next(error)
  }
}

// Admin logout (just client-side, no server action needed)
export const adminLogout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    next(error)
  }
}

// Get dashboard stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalPoems = await Poem.countDocuments()
    const publishedPoems = await Poem.countDocuments({ status: 'published' })
    const draftPoems = await Poem.countDocuments({ status: 'draft' })
    
    const totalReaders = await Reader.countDocuments()
    const subscribedReaders = await Subscription.countDocuments({ isActive: true })
    
    const totalRatings = await Rating.countDocuments()
    const avgRating = await Rating.aggregate([
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ])
    
    const totalViews = await Poem.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ])
    
    res.json({
      success: true,
      data: {
        poems: {
          total: totalPoems,
          published: publishedPoems,
          draft: draftPoems
        },
        readers: {
          total: totalReaders,
          subscribed: subscribedReaders
        },
        engagement: {
          totalRatings,
          avgRating: avgRating[0]?.average || 0,
          totalViews: totalViews[0]?.total || 0
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// Get admin settings
export const getSettings = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ username: 'NaKSh' }).select('settings')
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' })
    }
    
    res.json({
      success: true,
      data: admin.settings
    })
  } catch (error) {
    next(error)
  }
}

// Update admin settings
export const updateSettings = async (req, res, next) => {
  try {
    const allowedSettings = ['defaultTheme', 'siteTitle', 'siteDescription', 'emailNotificationsEnabled']
    
    const updates = { settings: {} }
    for (const field of allowedSettings) {
      if (req.body[field] !== undefined) {
        updates.settings[field] = req.body[field]
      }
    }
    
    const admin = await Admin.findOneAndUpdate(
      { username: 'NaKSh' },
      updates,
      { new: true }
    ).select('settings')
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' })
    }
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: admin.settings
    })
  } catch (error) {
    next(error)
  }
}

export default {
  adminLogin,
  adminLogout,
  getDashboardStats,
  getSettings,
  updateSettings
}
