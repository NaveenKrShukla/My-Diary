import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
  poemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poem',
    required: [true, 'Poem ID is required'],
    index: true
  },
  readerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reader',
    required: [true, 'Reader ID is required'],
    index: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [1000, 'Feedback must be less than 1000 characters'],
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'ratings'
})

// Compound index to ensure one rating per reader per poem
ratingSchema.index({ poemId: 1, readerId: 1 }, { unique: true })
ratingSchema.index({ poemId: 1, isPublic: 1 })

export default mongoose.model('Rating', ratingSchema)
