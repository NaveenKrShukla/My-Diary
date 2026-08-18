# Step 2: Backend API & Database Setup - Complete Implementation Guide

## 🎯 Overview
Building the complete REST API with database models, authentication, and 15+ endpoints.

**Duration:** 3-4 days | **Priority:** CRITICAL  
**Deliverables:** 6 models, 15+ API endpoints, JWT auth, error handling, validation

---

## 📋 Implementation Checklist

- [ ] Part 1: Create all 6 database models
- [ ] Part 2: Create authentication & middleware  
- [ ] Part 3: Create routes and controllers
- [ ] Part 4: Test all endpoints with curl
- [ ] Part 5: Error handling & validation
- [ ] Part 6: Git commit

---

## Part 1: Database Models Setup

### Step 1.1: Create Models Directory
```bash
cd backend
mkdir models
mkdir middleware
mkdir routes
mkdir controllers
```

Now create the 6 database models. I'll guide you through creating each file.

### Step 1.2: Create Poem Model
**File:** `backend/models/Poem.js`

This stores all poetry entries.

### Step 1.3: Create Reader Model  
**File:** `backend/models/Reader.js`

Stores reader profiles (no authentication needed - name and animal avatar only).

### Step 1.4: Create Rating Model
**File:** `backend/models/Rating.js`

Stores ratings and feedback for poems.

### Step 1.5: Create Theme Model
**File:** `backend/models/Theme.js`

Stores theme configurations.

### Step 1.6: Create Subscription Model
**File:** `backend/models/Subscription.js`

Stores email subscriptions for notifications.

### Step 1.7: Create Admin Model
**File:** `backend/models/Admin.js`

Admin user for the platform (username: NaKSh).

---

## Part 2: Authentication Setup

### Step 2.1: Create Auth Middleware
**File:** `backend/middleware/auth.js`

JWT verification for admin routes.

### Step 2.2: Create Error Handler Middleware
**File:** `backend/middleware/errorHandler.js`

Centralized error handling.

### Step 2.3: Create Validation Middleware
**File:** `backend/middleware/validation.js`

Input validation for all endpoints.

---

## Part 3: API Routes & Controllers

### API Endpoints to Create (15+)

**Poems:**
- `GET /api/poems` - Get all published poems
- `GET /api/poems/:id` - Get single poem
- `POST /api/poems` - Create poem (admin)
- `PUT /api/poems/:id` - Update poem (admin)
- `DELETE /api/poems/:id` - Delete poem (admin)
- `GET /api/poems/:id/export/pdf` - Export PDF
- `GET /api/poems/:id/export/jpeg` - Export JPEG

**Readers:**
- `POST /api/readers` - Create reader profile
- `GET /api/readers/:id` - Get reader profile
- `PUT /api/readers/:id` - Update reader profile

**Ratings & Feedback:**
- `POST /api/ratings` - Submit rating
- `GET /api/poems/:id/ratings` - Get poem ratings
- `GET /api/poems/:id/feedback` - Get public feedback

**Themes:**
- `GET /api/themes` - Get all themes
- `POST /api/themes` - Create theme (admin)
- `PUT /api/themes/:id` - Update theme (admin)

**Subscriptions:**
- `POST /api/subscriptions` - Subscribe to emails
- `DELETE /api/subscriptions/:token` - Unsubscribe

**Admin:**
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/dashboard` - Dashboard stats

---

## Implementation Instructions

### Quick Start Commands

1. **Create all model files:**
   ```bash
   cd backend/models
   # Create: Poem.js, Reader.js, Rating.js, Theme.js, Subscription.js, Admin.js
   ```

2. **Create middleware:**
   ```bash
   cd ../middleware
   # Create: auth.js, errorHandler.js, validation.js
   ```

3. **Create routes and controllers:**
   ```bash
   cd ../routes
   # Create: poems.js, readers.js, ratings.js, themes.js, subscriptions.js, admin.js
   
   cd ../controllers
   # Create: poemController.js, readerController.js, etc.
   ```

4. **Update server.js to use routes**

5. **Test all endpoints**

---

## Database Connection String

Before proceeding, make sure you have:

1. **MongoDB Atlas Connection String** from your cluster
2. **Updated `.env`** in backend folder:
   ```
   MONGODB_URI=mongodb+srv://diary_admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/my-diary
   ```

---

## What's Next

After following the complete implementation in the sections below, you'll have:
- ✅ 6 working database models
- ✅ JWT authentication for admin
- ✅ 15+ functional API endpoints
- ✅ Error handling and validation
- ✅ Ready for frontend integration

---

## Testing Your API

Once deployed, test endpoints:

```bash
# Test health
curl http://localhost:5000/api/health

# Get all poems
curl http://localhost:5000/api/poems

# Create reader
curl -X POST http://localhost:5000/api/readers \
  -H "Content-Type: application/json" \
  -d '{"name":"John","profilePicture":"cat"}'

# Admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"NaKSh","password":"your_password"}'
```

---

## Structure After Step 2

```
backend/
├── models/
│   ├── Poem.js
│   ├── Reader.js
│   ├── Rating.js
│   ├── Theme.js
│   ├── Subscription.js
│   └── Admin.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── routes/
│   ├── poems.js
│   ├── readers.js
│   ├── ratings.js
│   ├── themes.js
│   ├── subscriptions.js
│   └── admin.js
├── controllers/
│   ├── poemController.js
│   ├── readerController.js
│   ├── ratingController.js
│   ├── themeController.js
│   └── adminController.js
├── utils/
│   ├── emailService.js
│   └── validators.js
├── server.js
├── package.json
└── .env
```

---

## Next Actions

1. ✅ Create all model files (models/ folder)
2. ✅ Create middleware files (middleware/ folder)
3. ✅ Create routes and controllers (routes/, controllers/)
4. ✅ Update server.js with new routes
5. ✅ Test all endpoints
6. ✅ Commit to Git

Once you're ready, I'll guide you through creating each file with complete, working code!

Ready to start? Say **"create models"** and I'll generate all the model files for you.

