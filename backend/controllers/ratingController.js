import mongoose from 'mongoose'
import Rating from '../models/Rating.js'
import Poem from '../models/Poem.js'
import { validateRating } from '../middleware/validation.js'

// Submit a rating
export const submitRating = async (req, res, next) => {
  try {
    const { poemId, readerId, rating, feedback, isPublic } = req.body

    if (!validateRating(rating)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    // Check if poem exists
    const poem = await Poem.findById(poemId)
    if (!poem) {
      return res.status(404).json({ error: 'Poem not found' })
    }

    // Check if reader already rated this poem
    let existingRating = await Rating.findOne({ poemId, readerId })

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating
      existingRating.feedback = feedback || ''
      existingRating.isPublic = isPublic || false
      await existingRating.save()
    } else {
      // Create new rating
      existingRating = new Rating({
        poemId,
        readerId,
        rating,
        feedback: feedback || '',
        isPublic: isPublic || false
      })
      await existingRating.save()
    }

    // Update poem average rating
    const allRatings = await Rating.find({ poemId })
    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length

    await Poem.findByIdAndUpdate(poemId, {
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalRatings: allRatings.length
    })

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: existingRating
    })
  } catch (error) {
    next(error)
  }
}

// Get all ratings for a poem
export const getPoemRatings = async (req, res, next) => {
  try {
    const { poemId } = req.params

    if (!mongoose.Types.ObjectId.isValid(poemId)) {
      return res.json({
        success: true,
        data: {
          ratings: [],
          stats: {
            total: 0,
            average: 0
          }
        }
      })
    }

    const ratings = await Rating.find({ poemId })
      .populate('readerId', 'name profilePicture')
      .sort('-createdAt')

    const avgRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0

    res.json({
      success: true,
      data: {
        ratings,
        stats: {
          total: ratings.length,
          average: parseFloat(avgRating)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// Get public feedback for a poem
export const getPoemFeedback = async (req, res, next) => {
  try {
    const { poemId } = req.params

    if (!mongoose.Types.ObjectId.isValid(poemId)) {
      return res.json({
        success: true,
        data: []
      })
    }

    const feedback = await Rating.find({ poemId, isPublic: true, feedback: { $ne: '' } })
      .populate('readerId', 'name profilePicture')
      .select('rating feedback readerId createdAt')
      .sort('-createdAt')

    res.json({
      success: true,
      data: feedback
    })
  } catch (error) {
    next(error)
  }
}

// Get reader's ratings
export const getReaderRatings = async (req, res, next) => {
  try {
    const { readerId } = req.params

    const ratings = await Rating.find({ readerId })
      .populate('poemId', 'title')
      .sort('-createdAt')

    res.json({
      success: true,
      data: ratings
    })
  } catch (error) {
    next(error)
  }
}

// Delete a rating (admin only)
export const deleteRating = async (req, res, next) => {
  try {
    const { ratingId } = req.params

    const rating = await Rating.findByIdAndDelete(ratingId)

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' })
    }

    // Update poem average rating
    const allRatings = await Rating.find({ poemId: rating.poemId })
    const avgRating = allRatings.length > 0
      ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
      : 0

    await Poem.findByIdAndUpdate(rating.poemId, {
      avgRating: parseFloat(avgRating),
      totalRatings: allRatings.length
    })

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export default {
  submitRating,
  getPoemRatings,
  getPoemFeedback,
  getReaderRatings,
  deleteRating
}
