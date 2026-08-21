import mongoose from 'mongoose'
import Poem from '../models/Poem.js'
import Rating from '../models/Rating.js'
import { validatePoemData } from '../middleware/validation.js'

// Get all published poems (with sorting and filtering)
export const getAllPoems = async (req, res, next) => {
  try {
    const { sort = 'writtenDate', page = 1, limit = 1000, status } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const query = {}
    if (status && status !== 'all') {
      query.status = status
    } else if (!status) {
      query.status = 'published'
    }

    const poems = await Poem.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('theme', 'name colors typography')
      .exec()

    const total = await Poem.countDocuments(query)

    res.json({
      success: true,
      data: poems,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page)
      }
    })
  } catch (error) {
    next(error)
  }
}

// Get single poem by ID
export const getPoemById = async (req, res, next) => {
  try {
    const { id } = req.params

    const poem = await Poem.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('theme')

    if (!poem) {
      return res.status(404).json({ error: 'Poem not found' })
    }

    res.json({
      success: true,
      data: poem
    })
  } catch (error) {
    next(error)
  }
}

// Create poem (admin only)
export const createPoem = async (req, res, next) => {
  try {
    const validation = validatePoemData(req.body)
    if (validation.length > 0) {
      return res.status(400).json({ errors: validation })
    }

    const poem = new Poem({
      title: req.body.title,
      content: req.body.content,
      writtenDate: new Date(req.body.writtenDate),
      theme: (req.body.theme && mongoose.Types.ObjectId.isValid(req.body.theme)) ? req.body.theme : null,
      status: req.body.status || 'draft',
      tags: req.body.tags || []
    })

    await poem.save()

    res.status(201).json({
      success: true,
      message: 'Poem created successfully',
      data: poem
    })
  } catch (error) {
    next(error)
  }
}

// Update poem (admin only)
export const updatePoem = async (req, res, next) => {
  try {
    const { id } = req.params
    const allowedFields = ['title', 'content', 'writtenDate', 'theme', 'status', 'featured', 'tags', 'coverImage']

    const updates = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    }

    if (updates.theme !== undefined && updates.theme !== null && !mongoose.Types.ObjectId.isValid(updates.theme)) {
      updates.theme = null;
    }

    const poem = await Poem.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )

    if (!poem) {
      return res.status(404).json({ error: 'Poem not found' })
    }

    res.json({
      success: true,
      message: 'Poem updated successfully',
      data: poem
    })
  } catch (error) {
    next(error)
  }
}

// Delete poem (admin only)
export const deletePoem = async (req, res, next) => {
  try {
    const { id } = req.params

    const poem = await Poem.findByIdAndDelete(id)

    if (!poem) {
      return res.status(404).json({ error: 'Poem not found' })
    }

    // Delete associated ratings
    await Rating.deleteMany({ poemId: id })

    res.json({
      success: true,
      message: 'Poem deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// Get poem statistics
export const getPoemStats = async (req, res, next) => {
  try {
    const { id } = req.params

    const ratings = await Rating.find({ poemId: id })
    const publicFeedback = await Rating.find({ poemId: id, isPublic: true })

    res.json({
      success: true,
      data: {
        totalRatings: ratings.length,
        avgRating: ratings.length > 0
          ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
          : 0,
        publicFeedback: publicFeedback.length,
        ratings: ratings
      }
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllPoems,
  getPoemById,
  createPoem,
  updatePoem,
  deletePoem,
  getPoemStats
}
