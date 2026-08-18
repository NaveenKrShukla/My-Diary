import mongoose from 'mongoose'

const poemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Poem title is required'],
    trim: true,
    index: true,
    minlength: [1, 'Title must be at least 1 character'],
    maxlength: [200, 'Title must be less than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Poem content is required'],
    minlength: [10, 'Content must be at least 10 characters']
  },
  author: {
    type: String,
    default: 'NaKSh',
    immutable: true
  },
  writtenDate: {
    type: Date,
    required: [true, 'Written date is required']
  },
  uploadedDate: {
    type: Date,
    default: Date.now
  },
  theme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theme',
    default: null
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'published', 'archived'],
      message: 'Status must be draft, published, or archived'
    },
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: {
    type: [String],
    default: []
  },
  coverImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: 'poems'
})

// Index for faster queries
poemSchema.index({ status: 1, uploadedDate: -1 })
poemSchema.index({ title: 'text', content: 'text' })

export default mongoose.model('Poem', poemSchema)
