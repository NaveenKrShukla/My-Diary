import mongoose from 'mongoose'

const readerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name must be less than 50 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  profilePicture: {
    type: String,
    enum: {
      values: ['cat', 'dog', 'fox', 'owl', 'bird', 'rabbit', 'panda', 'koala', 'penguin', 'tiger', 'lion', 'bear'],
      message: 'Please select a valid animal profile picture'
    },
    default: 'cat'
  },
  subscribed: {
    type: Boolean,
    default: false
  },
  subscriptionPreference: {
    type: String,
    enum: {
      values: ['instant', 'weekly', 'monthly'],
      message: 'Subscription preference must be instant, weekly, or monthly'
    },
    default: 'instant'
  },
  lastVisit: {
    type: Date,
    default: null
  },
  annotations: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'readers'
})

export default mongoose.model('Reader', readerSchema)
