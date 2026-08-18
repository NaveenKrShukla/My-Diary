import express from 'express'
import Subscription from '../models/Subscription.js'
import { validateEmail } from '../middleware/validation.js'

const router = express.Router()

// Subscribe to newsletter
router.post('/', async (req, res, next) => {
  try {
    const { email, readerId, preference } = req.body

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' })
    }

    const existingSubscription = await Subscription.findOne({ email })

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({ error: 'Email already subscribed' })
      }
      // Reactivate subscription
      existingSubscription.isActive = true
      existingSubscription.preference = preference || 'instant'
      existingSubscription.readerId = readerId || existingSubscription.readerId
      await existingSubscription.save()

      return res.json({
        success: true,
        message: 'Subscription reactivated',
        data: existingSubscription
      })
    }

    const subscription = new Subscription({
      email,
      readerId: readerId || undefined,
      preference: preference || 'instant'
    })

    await subscription.save()

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: subscription
    })
  } catch (error) {
    next(error)
  }
})

// Unsubscribe by token
router.delete('/:token', async (req, res, next) => {
  try {
    const { token } = req.params

    const subscription = await Subscription.findOne({ unsubscribeToken: token })

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' })
    }

    subscription.isActive = false
    await subscription.save()

    res.json({
      success: true,
      message: 'Successfully unsubscribed'
    })
  } catch (error) {
    next(error)
  }
})

// Get subscription status (admin)
router.get('/status/:email', async (req, res, next) => {
  try {
    const { email } = req.params

    const subscription = await Subscription.findOne({ email })

    if (!subscription) {
      return res.json({
        success: true,
        data: { subscribed: false }
      })
    }

    res.json({
      success: true,
      data: {
        subscribed: subscription.isActive,
        preference: subscription.preference
      }
    })
  } catch (error) {
    next(error)
  }
})

export default router
