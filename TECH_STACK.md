# Tech Stack Recommendations - My Diary by NaKSh

## Frontend Stack

### Core Framework
- **React 18** - Component-based UI with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Ultra-fast build tool
- **Tailwind CSS** - Utility-first styling for rapid UI development

### Animations & Interactions
- **GSAP (GreenSock Animation Platform)** - Professional animations (scroll, zoom, flip)
- **Framer Motion** - React animation library for micro-interactions
- **AOS (Animate On Scroll)** - Scroll trigger animations
- **react-flip-toolkit** - Book page flip animations (alternative to custom CSS)

### UI & Components
- **Shadcn/ui** - Unstyled, accessible component library
- **Radix UI** - Primitive components for custom design
- **React Icons** - Icon library
- **Storybook** - Component development environment

### State Management
- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Server state management
- **Context API** - Built-in React state for themes

### Utils & Libraries
- **jsPDF** - PDF generation client-side
- **html2canvas** - Convert HTML to images
- **React Hook Form** - Efficient form handling
- **Zod** - TypeScript-first validation
- **axios** - HTTP client
- **react-hot-toast** - Toast notifications
- **react-markdown** - Markdown rendering

### Development Tools
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Chromatic** - Visual testing

---

## Backend Stack

### Core Framework
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Lightweight web framework
- **TypeScript** - Type safety

### Database
- **MongoDB** (Primary recommendation) + **Mongoose** ODM
  - Flexible schema for themes and customizations
  - Easy scaling
  - Good for JSON-like data (poems, metadata)
  
- **PostgreSQL** (Alternative)
  - Better for relational data
  - JSONB support for complex fields
  - More robust for production

### Authentication & Security
- **jsonwebtoken (JWT)** - Admin authentication
- **bcryptjs** - Password hashing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **validator** - Input validation
- **dotenv** - Environment variables

### Email & Notifications
- **Nodemailer** - Email sending
- **node-schedule** - Scheduled tasks (daily/weekly digests)
- **Bull** or **Bee-Queue** - Job queue for async email processing
- **SendGrid** or **AWS SES** - Email service provider (optional)

### File Handling & Storage
- **sharp** - High-performance image processing (JPEG generation)
- **multer** - File upload middleware
- **aws-sdk** - AWS S3 integration (optional)
- **pdfkit** - PDF generation (server-side alternative)

### Development Tools
- **Mocha** - Testing framework
- **Chai** - Assertion library
- **Supertest** - API testing
- **Nodemon** - Auto-reload during development
- **Morgan** - HTTP request logger
- **cors** - Cross-Origin Resource Sharing

### Monitoring & Analytics
- **Sentry** - Error tracking
- **Winston** - Logging
- **New Relic** or **DataDog** - Performance monitoring (optional)

---

## Database Design

### Collections/Tables

#### Poems
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  author: "NaKSh",
  writtenDate: Date,
  uploadedDate: Date,
  theme: ObjectId (ref: Theme),
  status: "draft" | "published" | "archived",
  featured: Boolean,
  views: Number,
  avgRating: Number,
  totalRatings: Number,
  tags: [String],
  coverImage: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

#### Ratings
```javascript
{
  _id: ObjectId,
  poemId: ObjectId (ref: Poem),
  readerId: ObjectId (ref: Reader),
  rating: Number (1-5),
  feedback: String,
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Readers
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (optional),
  profilePicture: String (animal choice),
  subscribed: Boolean,
  subscriptionPreference: "instant" | "weekly" | "monthly",
  createdAt: Date,
  lastVisit: Date,
  annotations: {
    poemId: {
      highlights: [{text, color, timestamp}],
      notes: [{text, position, timestamp}]
    }
  }
}
```

#### Themes
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  colors: {
    primary: String,
    secondary: String,
    background: String,
    text: String,
    accent: String,
    gradient: [String]
  },
  typography: {
    fontFamily: {
      headings: String,
      body: String
    },
    sizes: {
      heading1: Number,
      heading2: Number,
      body: Number
    }
  },
  animations: {
    pageFlipSpeed: Number,
    scrollAnimationSpeed: Number,
    enableLighting: Boolean,
    lightingIntensity: Number
  },
  preview: String (preview image URL),
  isActive: Boolean,
  createdAt: Date
}
```

#### Subscriptions
```javascript
{
  _id: ObjectId,
  email: String (unique),
  readerId: ObjectId (ref: Reader),
  preference: "instant" | "weekly" | "monthly",
  isActive: Boolean,
  lastEmailSent: Date,
  createdAt: Date,
  unsubscribeToken: String
}
```

#### Admin
```javascript
{
  _id: ObjectId,
  username: "NaKSh",
  passwordHash: String,
  email: String,
  settings: {
    defaultTheme: String,
    siteTitle: String,
    siteDescription: String,
    emailNotificationsEnabled: Boolean
  },
  lastLogin: Date,
  createdAt: Date
}
```

---

## API Endpoints Summary

### Poems
- `GET /api/poems` - Get all published poems
- `GET /api/poems/:id` - Get single poem
- `POST /api/poems` - Create poem (admin)
- `PUT /api/poems/:id` - Update poem (admin)
- `DELETE /api/poems/:id` - Delete poem (admin)
- `GET /api/poems/:id/export/pdf` - Export as PDF
- `GET /api/poems/:id/export/jpeg` - Export as JPEG

### Ratings & Feedback
- `POST /api/ratings` - Submit rating
- `GET /api/poems/:id/ratings` - Get poem ratings
- `GET /api/poems/:id/feedback` - Get public feedback

### Readers
- `POST /api/readers` - Create reader profile
- `GET /api/readers/:id` - Get reader profile
- `PUT /api/readers/:id` - Update reader profile
- `GET /api/readers/:id/annotations` - Get reader's annotations

### Themes
- `GET /api/themes` - Get all themes
- `GET /api/themes/:id` - Get single theme
- `POST /api/themes` - Create theme (admin)
- `PUT /api/themes/:id` - Update theme (admin)
- `DELETE /api/themes/:id` - Delete theme (admin)

### Subscriptions
- `POST /api/subscriptions` - Subscribe to emails
- `DELETE /api/subscriptions/:token` - Unsubscribe
- `GET /api/subscriptions/status/:email` - Check subscription status

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/dashboard` - Dashboard stats
- `POST /api/admin/notify-subscribers` - Send new poem notification

---

## Deployment Recommendations

### Frontend
- **Vercel** (Recommended) - Optimized for React, serverless functions
- **Netlify** - Similar to Vercel, great DX
- **AWS Amplify** - Full AWS integration
- **GitHub Pages** - Static hosting (backend required separately)

### Backend
- **Heroku** - Easy deployment, good for beginners
- **Railway.app** - Modern alternative to Heroku
- **DigitalOcean App Platform** - Good price-to-performance
- **AWS (EC2 + RDS)** - Enterprise solution
- **Render** - Developer-friendly deployment

### Database
- **MongoDB Atlas** - Cloud MongoDB (free tier available)
- **PostgreSQL on Heroku/Railway** - Managed databases
- **AWS RDS** - Managed relational databases
- **Supabase** - Open-source Firebase alternative

### File Storage
- **AWS S3** - Industry standard
- **Firebase Storage** - Google-backed solution
- **Cloudinary** - Image optimization included
- **DigitalOcean Spaces** - S3-compatible, affordable

### Email Service
- **Gmail SMTP** - Free, limited
- **SendGrid** - Free tier: 100 emails/day
- **AWS SES** - Very affordable at scale
- **Mailgun** - Developer-friendly
- **Resend** - Modern email API

---

## Package.json Dependencies Reference

### Frontend Key Dependencies
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "vite": "^5.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "gsap": "^3.x",
  "framer-motion": "^10.x",
  "react-hook-form": "^7.x",
  "axios": "^1.x",
  "zustand": "^4.x",
  "@tanstack/react-query": "^5.x",
  "jspdf": "^2.x",
  "html2canvas": "^1.x"
}
```

### Backend Key Dependencies
```json
{
  "express": "^4.x",
  "mongoose": "^8.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "nodemailer": "^6.x",
  "multer": "^1.x",
  "sharp": "^0.x",
  "cors": "^2.x",
  "dotenv": "^16.x",
  "helmet": "^7.x",
  "express-rate-limit": "^7.x",
  "bull": "^4.x",
  "node-schedule": "^2.x"
}
```

---

## Performance Targets

- **Frontend Bundle Size:** < 200KB (gzipped)
- **Initial Load Time:** < 2 seconds
- **Time to Interactive:** < 3 seconds
- **Lighthouse Score:** 90+
- **GSAP Animation FPS:** 60
- **API Response Time:** < 200ms
- **PDF Generation:** < 3 seconds
- **JPEG Export:** < 2 seconds

---

## Security Considerations

1. **Authentication:** JWT for admin, local storage for readers (no sensitive data)
2. **CORS:** Restrict to your domain
3. **Rate Limiting:** Prevent API abuse
4. **Input Validation:** Zod/Validator on frontend and backend
5. **HTTPS:** Required for deployment
6. **SQL Injection Prevention:** Use parameterized queries (Mongoose handles this)
7. **XSS Prevention:** Sanitize user input (email-validator)
8. **CSRF Protection:** SameSite cookies
9. **Password Security:** bcryptjs for hashing
10. **Environment Variables:** Never commit secrets to git

---

## Next Steps

1. Initialize frontend project with Vite + React + TypeScript
2. Set up backend with Express + MongoDB connection
3. Create database schemas and models
4. Implement core API endpoints
5. Build landing page with GSAP animations
6. Implement book-like poem display
7. Add theme system
8. Build admin dashboard
9. Integrate email notifications
10. Deploy and optimize

