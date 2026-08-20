import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import errorHandler from './middleware/errorHandler.js'

// Route imports
import poemsRouter from './routes/poems.js'
import readersRouter from './routes/readers.js'
import ratingsRouter from './routes/ratings.js'
import themesRouter from './routes/themes.js'
import subscriptionsRouter from './routes/subscriptions.js'
import adminRouter from './routes/admin.js'

dotenv.config()

const app = express()

// Security & CORS Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Database Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false // Fail fast if MongoDB is offline instead of buffering queries
  })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err))
} else {
  console.log('⚠️  MONGODB_URI not set in .env - running without database')
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API Routes
app.use('/api/poems', poemsRouter)
app.use('/api/readers', readersRouter)
app.use('/api/ratings', ratingsRouter)
app.use('/api/themes', themesRouter)
app.use('/api/subscriptions', subscriptionsRouter)
app.use('/api/admin', adminRouter)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  
  // Anything that doesn't match an API route should serve index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next()
    }
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })
}

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Centralized error handling (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📝 Test endpoint: http://localhost:${PORT}/api/health`)
  console.log(`📚 API Routes:`)
  console.log(`  - Poems: http://localhost:${PORT}/api/poems`)
  console.log(`  - Readers: http://localhost:${PORT}/api/readers`)
  console.log(`  - Ratings: http://localhost:${PORT}/api/ratings`)
  console.log(`  - Themes: http://localhost:${PORT}/api/themes`)
  console.log(`  - Admin: http://localhost:${PORT}/api/admin`)
})
