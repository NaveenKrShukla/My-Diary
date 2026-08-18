import mongoose from 'mongoose'

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theme name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  colors: {
    primary: { type: String, default: '#8b5cf6' },
    secondary: { type: String, default: '#3b82f6' },
    background: { type: String, default: '#0f0f0f' },
    text: { type: String, default: '#e8e8e8' },
    accent: { type: String, default: '#f59e0b' },
    gradient: {
      type: [String],
      default: ['#8b5cf6', '#3b82f6']
    }
  },
  typography: {
    fontFamily: {
      headings: { type: String, default: 'Playfair Display' },
      body: { type: String, default: 'Inter' }
    },
    sizes: {
      heading1: { type: Number, default: 48 },
      heading2: { type: Number, default: 36 },
      body: { type: Number, default: 16 }
    }
  },
  animations: {
    pageFlipSpeed: {
      type: Number,
      default: 0.6,
      min: 0.1,
      max: 2
    },
    scrollAnimationSpeed: {
      type: Number,
      default: 0.3,
      min: 0.1,
      max: 1
    },
    enableLighting: {
      type: Boolean,
      default: true
    },
    lightingIntensity: {
      type: Number,
      default: 1,
      min: 0,
      max: 2
    }
  },
  preview: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'themes'
})

export default mongoose.model('Theme', themeSchema)
