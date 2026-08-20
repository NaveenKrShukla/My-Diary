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
const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI
if (dbUri) {
  mongoose.connect(dbUri, {
    bufferCommands: false // Fail fast if MongoDB is offline instead of buffering queries
  })
    .then(async () => {
      console.log('✅ MongoDB connected')
      
      // Auto-initialize admin user if database is empty
      try {
        const Admin = (await import('./models/Admin.js')).default
        const adminExists = await Admin.findOne({ username: 'NaKSh' })
        if (!adminExists) {
          const admin = new Admin({
            username: 'NaKSh',
            passwordHash: 'NaKShPoetry123',
            email: process.env.ADMIN_EMAIL || 'admin@mydiary.local',
            settings: {
              defaultTheme: 'dark',
              siteTitle: 'My Diary',
              siteDescription: 'A premium poetry sharing platform by NaKSh',
              emailNotificationsEnabled: true
            }
          })
          await admin.save()
          console.log('✅ Auto-initialized default admin user "NaKSh"')
        }

        // Auto-populate poems if database is empty
        const Poem = (await import('./models/Poem.js')).default
        const poemCount = await Poem.countDocuments()
        if (poemCount === 0) {
          await Poem.create([
            {
              title: "Whispers of the Wind",
              content: "The autumn leaves dance in the air,\nA quiet sigh from everywhere.\nIn shadows deep, the secrets keep,\nWhile the silent forest falls asleep.",
              author: "NaKSh",
              tags: ["nature", "serene"],
              isPublic: true,
              writtenDate: new Date()
            },
            {
              title: "Echoes of Silence",
              content: "In the quiet corners of the mind,\nAre words we left behind.\nLike pebbles cast into the deep,\nThe silent promises we keep.",
              author: "NaKSh",
              tags: ["reflective", "mind"],
              isPublic: true,
              writtenDate: new Date()
            }
          ])
          console.log('✅ Auto-populated database with default poems')
        }
      } catch (err) {
        console.error('❌ Database auto-initialization failed:', err.message)
      }
    })
    .catch(err => console.error('❌ MongoDB connection error:', err))
} else {
  console.log('⚠️  MONGODB_URI or MONGO_URI not set in environment - running without database')
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
  app.get(/^(?!\/api).*/, (req, res) => {
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
