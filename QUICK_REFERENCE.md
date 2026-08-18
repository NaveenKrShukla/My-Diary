# Quick Reference Guide - My Diary by NaKSh

## 📋 10-Step Implementation Summary

```
FOUNDATION & SETUP (2-3 days)
    ↓
    Step 1: Project Architecture & Environment Setup

CORE INFRASTRUCTURE (3-4 days)
    ↓
    Step 2: Backend API & Database Setup

CORE FRONTEND - READER (8-11 days)
    ├─→ Step 3: Landing Page & Navigation Architecture (2-3 days)
    ├─→ Step 4: Book-Like Poem Display System (4-5 days)
    └─→ Step 5: Reader Profile & Interactive Features (2-3 days)

ADVANCED FEATURES (11-15 days)
    ├─→ Step 6: Premium Theme System (3-4 days)
    ├─→ Step 7: Admin Dashboard & Poem Management (4-5 days)
    ├─→ Step 8: Export & Download Features (2-3 days)
    └─→ Step 9: Email Subscription & Notification System (2-3 days)

POLISH & DEPLOYMENT (3-5 days)
    ↓
    Step 10: Testing, Optimization & Deployment

TOTAL TIMELINE: 27-38 Days
```

---

## 🎯 Key Milestones

| Milestone        | Target Date | Deliverable                                         |
| ---------------- | ----------- | --------------------------------------------------- |
| Phase 1 Complete | Day 3-7     | Working backend, database, project structure        |
| Phase 2 Complete | Day 7-18    | Landing page, book display, reader profiles working |
| Phase 3 Complete | Day 18-33   | Themes, admin panel, exports, email ready           |
| Phase 4 Complete | Day 33-38   | Fully tested, deployed, live                        |

---

## 🔧 Technology Quick Links

**Animation Library:**

- GSAP: https://gsap.com/docs/
- Framer Motion: https://www.framer.com/motion/

**PDF/Export:**

- jsPDF: https://github.com/parallax/jsPDF
- html2canvas: https://html2canvas.hertzen.com/
- Sharp.js: https://sharp.pixelplumbing.com/

**Database:**

- MongoDB: https://www.mongodb.com/docs/
- Mongoose: https://mongoosejs.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

**Backend:**

- Express.js: https://expressjs.com/
- Node.js: https://nodejs.org/

**Frontend:**

- React: https://react.dev/
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/

**Email:**

- Nodemailer: https://nodemailer.com/
- SendGrid: https://sendgrid.com/
- AWS SES: https://aws.amazon.com/ses/

---

## 📊 API Endpoint Reference

### Reader-Facing Endpoints

```
GET  /api/poems                    # Get all published poems
GET  /api/poems/:id               # Get single poem
POST /api/ratings                 # Submit rating
GET  /api/poems/:id/ratings       # Get poem ratings
POST /api/readers                 # Create reader profile
GET  /api/poems/:id/export/pdf    # Export as PDF
GET  /api/poems/:id/export/jpeg   # Export as JPEG
POST /api/subscriptions           # Subscribe to emails
```

### Admin-Only Endpoints

```
POST   /api/admin/login           # Admin login
POST   /api/poems                 # Create poem
PUT    /api/poems/:id             # Update poem
DELETE /api/poems/:id             # Delete poem
POST   /api/themes                # Create theme
PUT    /api/themes/:id            # Update theme
GET    /api/admin/dashboard       # Dashboard stats
```

---

## 🎨 Design System Quick Reference

### Color Palette (Dark Theme)

```
Primary Background:   #0f0f0f (almost black)
Secondary:           #1a1a1a
Text:                #e8e8e8 (light gray)
Accent:              #8b5cf6 (purple)
Gradient:            #8b5cf6 → #3b82f6 (purple to blue)
Highlight:           #f59e0b (amber)
Success:             #10b981 (emerald)
```

### Typography Recommendations

```
Headings:  Playfair Display, Georgia, or elegant serif
Body:      Inter, Poppins, or clean sans-serif
Mono:      JetBrains Mono, Fira Code

Font Sizes:
  H1: 3-3.5rem
  H2: 2-2.5rem
  H3: 1.5-2rem
  Body: 1-1.125rem
  Small: 0.875rem
```

### Spacing Scale

```
xs:  0.25rem (4px)
sm:  0.5rem  (8px)
md:  1rem    (16px)
lg:  1.5rem  (24px)
xl:  2rem    (32px)
2xl: 3rem    (48px)
```

---

## 📱 Responsive Breakpoints

```
Mobile:      < 480px
Tablet:      480px - 768px
Desktop:     > 768px
Large:       > 1024px
Extra Large: > 1280px
```

---

## 🚀 Quick Start Commands

### Frontend Setup

```bash
npm create vite@latest my-diary-frontend -- --template react
cd my-diary-frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install gsap framer-motion axios zustand @tanstack/react-query
npm install jspdf html2canvas
npm run dev
```

### Backend Setup

```bash
mkdir my-diary-backend
cd my-diary-backend
npm init -y
npm install express cors helmet dotenv mongoose jsonwebtoken bcryptjs
npm install -D nodemon
npm install nodemailer bull node-schedule sharp multer
touch .env
npm run dev
```

### Database Setup

```bash
# MongoDB Atlas (recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to .env: MONGODB_URI=mongodb+srv://...
```

---

## 🐛 Common Pitfalls to Avoid

1. **GSAP Animations** - Always ensure animations run at 60 FPS, test on lower-end devices
2. **Book Flip Effect** - Prevent simultaneous page flips, add debouncing
3. **Theme Switching** - Ensure smooth transitions, avoid color flashing
4. **PDF Generation** - Set timeouts for large poems (> 5000 words)
5. **Email Delivery** - Implement proper error handling and retry logic
6. **Database Indexing** - Add indexes for frequent queries (poemId, readerId)
7. **Image Optimization** - Always compress uploaded images, use WebP where possible
8. **Mobile Touch** - Test swipe gestures on actual mobile devices
9. **Accessibility** - Don't rely solely on color to convey information
10. **Security** - Never expose admin credentials in frontend code

---

## 📈 Performance Targets

| Metric              | Target  | Tool                        |
| ------------------- | ------- | --------------------------- |
| Initial Load        | < 2s    | Lighthouse, WebPageTest     |
| Time to Interactive | < 3s    | Lighthouse                  |
| GSAP Animation FPS  | 60      | Chrome DevTools Performance |
| API Response        | < 200ms | Postman, Network tab        |
| Bundle Size         | < 200KB | Webpack Bundle Analyzer     |
| Lighthouse Score    | 90+     | Lighthouse                  |
| PDF Generation      | < 3s    | Custom timing logs          |
| JPEG Export         | < 2s    | Custom timing logs          |

---

## 🔒 Security Checklist (Before Launch)

- [ ] Change default admin credentials
- [ ] Enable HTTPS/SSL
- [ ] Set proper CORS headers
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Hash admin passwords (bcryptjs)
- [ ] Use environment variables for secrets
- [ ] Implement CSRF protection
- [ ] Set secure cookie flags
- [ ] Enable SQL injection prevention
- [ ] Regular security audits
- [ ] Monitor error logs for breaches

---

## 📞 Support & Resources

### Frontend Resources

- React Best Practices: https://react.dev/learn
- GSAP Docs: https://gsap.com/docs/
- Tailwind CSS: https://tailwindcss.com/docs

### Backend Resources

- Express.js Guide: https://expressjs.com/en/guide/routing.html
- Mongoose Docs: https://mongoosejs.com/docs/api.html
- Node.js Best Practices: https://nodejs.org/en/docs/guides/

### Deployment Resources

- Vercel Docs: https://vercel.com/docs
- Heroku Docs: https://devcenter.heroku.com/
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/

### Community

- Stack Overflow: Tag your questions [react], [express], [mongodb]
- GitHub Discussions: Open source library communities
- Dev.to: Great tutorials and articles

---

## 📝 File Structure Reference

```
my-diary/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── BookDisplay.jsx
│   │   │   ├── ThemeSwitcher.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── ReaderProfile.jsx
│   │   ├── pages/
│   │   │   ├── Reader.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── NotFound.jsx
│   │   ├── hooks/
│   │   │   ├── useTheme.js
│   │   │   ├── usePoemData.js
│   │   │   └── useAnnotations.js
│   │   ├── utils/
│   │   │   ├── animationConfig.js
│   │   │   ├── colorPalettes.js
│   │   │   └── exportHelpers.js
│   │   ├── styles/
│   │   │   ├── theme.css
│   │   │   └── animations.css
│   │   └── App.jsx
│   └── index.html
│
├── backend/
│   ├── routes/
│   │   ├── poems.js
│   │   ├── readers.js
│   │   ├── ratings.js
│   │   ├── themes.js
│   │   ├── subscriptions.js
│   │   └── admin.js
│   ├── models/
│   │   ├── Poem.js
│   │   ├── Reader.js
│   │   ├── Rating.js
│   │   ├── Theme.js
│   │   ├── Subscription.js
│   │   └── Admin.js
│   ├── controllers/
│   │   ├── poemController.js
│   │   ├── readerController.js
│   │   ├── ratingController.js
│   │   ├── themeController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── exportService.js
│   │   └── logger.js
│   ├── jobs/
│   │   └── emailJobs.js
│   ├── server.js
│   └── .env
│
└── docs/
    ├── PROJECT_PLAN.md
    ├── TECH_STACK.md
    ├── FEATURE_CHECKLIST.md
    ├── API_REFERENCE.md
    └── QUICK_START.md
```

---

## ✅ Next Immediate Steps

1. **Today:**
   - [ ] Review the PROJECT_PLAN.md thoroughly
   - [ ] Discuss tech stack choices with your team (if any)
   - [ ] Set up GitHub repository
   - [ ] Allocate development calendar

2. **This Week:**
   - [ ] Create frontend and backend project structures
   - [ ] Set up MongoDB database and connection
   - [ ] Initialize Git workflow
   - [ ] Plan UI mockups in Figma (optional)

3. **Next Week:**
   - [ ] Start Step 1 implementation
   - [ ] Set up development environment
   - [ ] Create database schemas
   - [ ] Begin Step 2 backend work

---

## 💡 Pro Tips

1. **Use Figma** for UI mockups before coding (saves time)
2. **Set up GitHub CI/CD** early for automated testing
3. **Document as you code** - future you will thank you
4. **Test on real mobile devices**, not just DevTools
5. **Keep animations smooth** - Use transform and opacity only (avoid layout-triggering properties)
6. **Version your API** - Makes future updates easier
7. **Implement monitoring early** - Catch bugs before users do
8. **Collect user feedback** - Iterate based on real usage
9. **Backup your database** regularly
10. **Keep dependencies updated** for security patches

---

Generated: August 18, 2026
Last Updated: August 18, 2026
