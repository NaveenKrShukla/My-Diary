import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Admin from './models/Admin.js'

dotenv.config()

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'NaKSh' })

    if (existingAdmin) {
      console.log('⚠️  Admin user "NaKSh" already exists')
      console.log(`   Email: ${existingAdmin.email}`)
      console.log(`   Last login: ${existingAdmin.lastLogin || 'Never'}`)

      // Update password if provided
      if (process.argv[2]) {
        existingAdmin.passwordHash = process.argv[2]
        await existingAdmin.save()
        console.log('✅ Admin password updated')
      }
    } else {
      // Create new admin
      const defaultPassword = process.argv[2] || 'NaKShPoetry123'

      const admin = new Admin({
        username: 'NaKSh',
        passwordHash: defaultPassword,
        email: process.env.ADMIN_EMAIL || 'admin@mydiary.local',
        settings: {
          defaultTheme: 'dark',
          siteTitle: 'My Diary',
          siteDescription: 'A premium poetry sharing platform by NaKSh',
          emailNotificationsEnabled: true
        }
      })

      await admin.save()
      console.log('✅ Admin user "NaKSh" created successfully!')
      console.log(`   Email: ${admin.email}`)
      console.log(`   Password: ${defaultPassword} (change immediately in production)`)
    }

    // Create default themes
    const Theme = (await import('./models/Theme.js')).default
    const themes = [
      {
        name: 'Dark',
        description: 'Premium dark theme with purple accents',
        colors: {
          primary: '#8b5cf6',
          secondary: '#3b82f6',
          background: '#0f0f0f',
          text: '#e8e8e8',
          accent: '#f59e0b',
          gradient: ['#8b5cf6', '#3b82f6']
        }
      },
      {
        name: 'Zen',
        description: 'Calm and peaceful theme',
        colors: {
          primary: '#10b981',
          secondary: '#06b6d4',
          background: '#f0fdf4',
          text: '#1f2937',
          accent: '#6d28d9',
          gradient: ['#10b981', '#06b6d4']
        }
      }
    ]

    for (const themeData of themes) {
      const existingTheme = await Theme.findOne({ name: themeData.name })
      if (!existingTheme) {
        const theme = new Theme(themeData)
        await theme.save()
        console.log(`✅ Theme "${themeData.name}" created`)
      }
    }

    console.log('\n🎉 Setup complete!')
    console.log('\nNextSteps:')
    console.log('1. Update .env with your MongoDB URI if not done yet')
    console.log('2. Start backend: npm run dev')
    console.log('3. Test API: curl http://localhost:5000/api/health')
    console.log('4. Login with admin: username="NaKSh", password=' + (process.argv[2] || 'NaKShPoetry123'))

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Setup error:', error.message)
    process.exit(1)
  }
}

setupAdmin()
