import mongoose from 'mongoose'
import crypto from 'crypto'

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  readerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reader',
    default: null
  },
  preference: {
    type: String,
    enum: {
      values: ['instant', 'weekly', 'monthly'],
      message: 'Preference must be instant, weekly, or monthly'
    },
    default: 'instant'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastEmailSent: {
    type: Date,
    default: null
  },
  unsubscribeToken: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(32).toString('hex')
  }
}, {
  timestamps: true,
  collection: 'subscriptions'
})

subscriptionSchema.index({ email: 1 })
subscriptionSchema.index({ unsubscribeToken: 1 })

export default mongoose.model('Subscription', subscriptionSchema)
