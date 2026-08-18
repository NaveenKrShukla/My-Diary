# Step 1: Getting Started - Project Setup Guide

## Overview

This guide will walk you through setting up your complete development environment for "My Diary by NaKSh". After completing this step, you'll have a working project structure, database connection, and basic development setup.

**Duration:** 2-3 days  
**Difficulty:** Beginner to Intermediate

---

## Prerequisites

Make sure you have installed:

- **Node.js** (v18 or higher) - https://nodejs.org/
- **Git** - https://git-scm.com/
- **VS Code** - https://code.visualstudio.com/
- **MongoDB Atlas account** (free) - https://www.mongodb.com/cloud/atlas
- A code editor with terminal support

### Check Installations

```bash
node --version          # Should be v18+
npm --version          # Should be v9+
git --version          # Any recent version
```

---

## Part 1: GitHub Repository Setup

### 1.1 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `my-diary-by-naksh`
3. Description: "A premium poetry sharing platform with theme-based UI, animations, and admin panel"
4. Choose **Private** (initially)
5. Initialize with README
6. Add `.gitignore` for Node.js
7. Click "Create repository"

### 1.2 Clone Repository Locally

```bash
git clone https://github.com/YOUR_USERNAME/my-diary-by-naksh.git
cd my-diary-by-naksh
```

### 1.3 Initial Structure

```bash
mkdir frontend backend database docs
touch README.md .env.example
echo "# My Diary by NaKSh - Architecture" > README.md
```

---

## Part 2: Database Setup

### 2.1 MongoDB Atlas Configuration

**Step 1: Create Account & Cluster**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new project: "My Diary"
4. Build a cluster (select free tier)
5. Choose region closest to you
6. Wait for cluster to be created (2-3 minutes)

**Step 2: Whitelist IP & Create User**

1. Go to "Network Access" → "Add IP Address"
2. Select "Allow access from anywhere" (for development)
3. Go to "Database Access" → "Add New User"
4. Username: `diary_admin`
5. Password: Generate strong password, save it
6. Default privileges: Read and write to any database

**Step 3: Get Connection String**

1. Click "Connect"
2. Select "Connect with MongoDB Compass" or "Connect to application"
3. Choose Node.js driver
4. Copy connection string
5. Replace `<password>` with your password
6. Save for `.env` file

Example connection string format:

```
mongodb+srv://diary_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/my-diary?retryWrites=true&w=majority
```

### 2.2 Database Schema Design

Create `database/schemas.md`:

```markdown
# My Diary Database Schema

## Collections

### poems

- \_id: ObjectId (auto)
- title: String (required, indexed)
- content: String (required)
- author: String (default: "NaKSh")
- writtenDate: Date (required)
- uploadedDate: Date (auto, now)
- theme: ObjectId (ref: Theme)
- status: String ("draft", "published", "archived")
- featured: Boolean (default: false)
- views: Number (default: 0)
- avgRating: Number (default: 0)
- totalRatings: Number (default: 0)
- tags: [String]
- coverImage: String (optional URL)
- createdAt: Date (auto)
- updatedAt: Date (auto)

### readers

- \_id: ObjectId (auto)
- name: String (required)
- email: String (optional, unique)
- profilePicture: String (animal choice: cat, dog, fox, owl, etc.)
- subscribed: Boolean (default: false)
- subscriptionPreference: String ("instant", "weekly", "monthly")
- createdAt: Date (auto)
- lastVisit: Date
- annotations: Object (poemId -> highlights/notes)

### ratings

- \_id: ObjectId (auto)
- poemId: ObjectId (ref: Poem, indexed)
- readerId: ObjectId (ref: Reader)
- rating: Number (1-5)
- feedback: String (optional)
- isPublic: Boolean (default: false)
- createdAt: Date (auto)
- updatedAt: Date (auto)

### themes

- \_id: ObjectId (auto)
- name: String (required, unique)
- description: String
- colors: Object {primary, secondary, background, text, accent, gradient}
- typography: Object {fontFamily, sizes}
- animations: Object {speed, easing, intensity}
- preview: String (image URL)
- isActive: Boolean (default: true)
- createdAt: Date
- updatedAt: Date

### subscriptions

- \_id: ObjectId (auto)
- email: String (unique, indexed)
- readerId: ObjectId (ref: Reader)
- preference: String ("instant", "weekly", "monthly")
- isActive: Boolean (default: true)
- lastEmailSent: Date
- createdAt: Date
- unsubscribeToken: String

### admin

- \_id: ObjectId (auto)
- username: String (unique, "NaKSh")
- passwordHash: String (hashed with bcryptjs)
- email: String
- settings: Object
- lastLogin: Date
- createdAt: Date
```

Save this file: `database/schemas.md`

---

## Part 3: Frontend Setup

### 3.1 Create Frontend Project

```bash
cd frontend
npm create vite@latest . -- --template react
npm install
```

### 3.2 Install Core Dependencies

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

npm install gsap framer-motion
npm install axios zustand @tanstack/react-query
npm install jspdf html2canvas
npm install react-router-dom
npm install zod react-hook-form
npm install react-hot-toast
```

### 3.3 Tailwind CSS Configuration

Edit `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8b5cf6",
        secondary: "#3b82f6",
        dark: {
          950: "#0f0f0f",
          900: "#1a1a1a",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

### 3.4 Frontend Structure

```bash
mkdir -p src/{components,pages,hooks,utils,styles,store}
touch src/App.jsx src/main.jsx
```

Create `src/App.jsx`:

```javascript
import React from "react";
import "./styles/index.css";

function App() {
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <h1 className="text-4xl font-display">My Diary by NaKSh</h1>
      <p className="text-lg">Coming soon...</p>
    </div>
  );
}

export default App;
```

### 3.5 Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "format": "prettier --write src"
  }
}
```

Test frontend:

```bash
npm run dev
# Visit http://localhost:5173
```

---

## Part 4: Backend Setup

### 4.1 Create Express Server

```bash
cd ../backend
npm init -y
```

Edit `package.json`:

```json
{
  "name": "my-diary-backend",
  "version": "1.0.0",
  "type": "module",
  "description": "REST API for My Diary",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.1.1",
    "bcryptjs": "^2.4.3",
    "express-rate-limit": "^7.1.1",
    "multer": "^1.4.5",
    "sharp": "^0.33.0",
    "nodemailer": "^6.9.7",
    "bull": "^4.11.6",
    "node-schedule": "^2.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

Install dependencies:

```bash
npm install
npm install -D nodemon
```

### 4.2 Create Environment File

Create `.env`:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://diary_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/my-diary?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Admin
ADMIN_USERNAME=NaKSh
ADMIN_PASSWORD_HASH=will_be_hashed_during_setup

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

Save `.env.example` to share with team (without sensitive values)

### 4.3 Create Basic Server

Create `server.js`:

```javascript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
});
app.use(limiter);

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Basic route
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 4.4 Test Backend

```bash
npm run dev
# Should see: ✅ MongoDB connected
# Should see: 🚀 Server running on http://localhost:5000

# Test in another terminal:
curl http://localhost:5000/api/health
```

---

## Part 5: Backend Structure

### 5.1 Create Folder Structure

```bash
mkdir -p models routes controllers middleware utils jobs
```

### 5.2 Create Models Directory

Create `models/Poem.js`:

```javascript
import mongoose from "mongoose";

const poemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    content: { type: String, required: true },
    author: { type: String, default: "NaKSh" },
    writtenDate: { type: Date, required: true },
    uploadedDate: { type: Date, default: Date.now },
    theme: { type: mongoose.Schema.Types.ObjectId, ref: "Theme" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    tags: [String],
    coverImage: String,
  },
  { timestamps: true },
);

export default mongoose.model("Poem", poemSchema);
```

Create `models/Theme.js`:

```javascript
import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    colors: {
      primary: String,
      secondary: String,
      background: String,
      text: String,
      accent: String,
      gradient: [String],
    },
    typography: {
      fontFamily: {
        headings: String,
        body: String,
      },
      sizes: {
        heading1: Number,
        heading2: Number,
        body: Number,
      },
    },
    animations: {
      pageFlipSpeed: { type: Number, default: 0.6 },
      scrollAnimationSpeed: { type: Number, default: 0.3 },
      enableLighting: { type: Boolean, default: true },
      lightingIntensity: { type: Number, default: 1 },
    },
    preview: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Theme", themeSchema);
```

Create `models/Reader.js`:

```javascript
import mongoose from "mongoose";

const readerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    profilePicture: {
      type: String,
      enum: [
        "cat",
        "dog",
        "fox",
        "owl",
        "bird",
        "rabbit",
        "panda",
        "koala",
        "penguin",
        "tiger",
        "lion",
        "bear",
      ],
      default: "cat",
    },
    subscribed: { type: Boolean, default: false },
    subscriptionPreference: {
      type: String,
      enum: ["instant", "weekly", "monthly"],
      default: "instant",
    },
    lastVisit: Date,
    annotations: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

export default mongoose.model("Reader", readerSchema);
```

### 5.3 Create Middleware

Create `middleware/auth.js`:

```javascript
import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default verifyAdmin;
```

### 5.4 Create Utils

Create `utils/emailService.js`:

```javascript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email error to ${to}:`, error);
    throw error;
  }
};

export default sendEmail;
```

---

## Part 6: Setup Environment & Configuration

### 6.1 Create Root .env.example

```bash
cd ..
cat > .env.example << 'EOF'
# Frontend
VITE_API_URL=http://localhost:5000

# Backend
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/my-diary
JWT_SECRET=change_this_in_production
ADMIN_USERNAME=NaKSh
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password
EOF
```

### 6.2 Create Root .gitignore

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
.next

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*

# Testing
coverage/
.nyc_output/

# Misc
.cache
temp/
tmp/
EOF
```

---

## Part 7: Documentation & Planning

### 7.1 Create README

Create `README.md`:

````markdown
# My Diary by NaKSh

A premium poetry sharing platform with theme-based UI, stunning animations, and admin panel.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free)
- Git

### Installation

1. Clone repository
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/my-diary-by-naksh.git
   cd my-diary-by-naksh
   \`\`\`

2. Setup Frontend
   \`\`\`bash
   cd frontend
   npm install
   npm run dev

# Frontend: http://localhost:5173

\`\`\`

3. Setup Backend (in new terminal)
   \`\`\`bash
   cd backend
   npm install
   npm run dev

# Backend: http://localhost:5000

\`\`\`

## 📁 Project Structure

- \`frontend/\` - React + Vite + Tailwind
- \`backend/\` - Express.js + MongoDB
- \`database/\` - Database schemas
- \`docs/\` - Documentation

## 📝 Implementation Plan

See [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) for detailed 10-step plan.

## 🎯 Current Status

- ✅ Step 1: Project Setup (In Progress)
- ⬜ Step 2: Backend Setup (Pending)
- ⬜ Step 3-10: In Queue

## 📖 Documentation

- [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md)
- [TECH_STACK.md](./docs/TECH_STACK.md)
- [FEATURE_CHECKLIST.md](./docs/FEATURE_CHECKLIST.md)
- [QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)
  \`\`\`

Save to root as `README.md`

---

## Part 8: Git Workflow

### 8.1 Initial Commit

```bash
cd ..
git add .
git commit -m "Step 1: Initial project setup with frontend, backend, and database configuration"
git push origin main
```
````

### 8.2 Create Development Branch

```bash
git checkout -b develop
git push origin develop
```

---

## ✅ Completion Checklist

**Step 1 is complete when:**

- [ ] Repository created on GitHub
- [ ] Frontend project initialized with Vite
- [ ] Backend server created with Express
- [ ] Tailwind CSS configured
- [ ] MongoDB Atlas cluster created and connected
- [ ] `.env` file created with proper configuration
- [ ] Both frontend and backend running successfully
- [ ] Initial commit pushed to GitHub
- [ ] All documentation files created
- [ ] Team members can clone and run project locally

---

## 🎯 Next Steps (Step 2)

Once Step 1 is complete, proceed to **Step 2: Backend API & Database Setup**

In Step 2 you will:

1. Create all database models (Poem, Reader, Rating, Theme, etc.)
2. Implement JWT authentication
3. Create REST API endpoints (15+ endpoints)
4. Set up error handling and validation
5. Implement email service integration

---

## 🆘 Troubleshooting

### MongoDB Connection Error

- Check connection string in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct

### Port Already in Use

```bash
# For Linux/Mac:
lsof -i :5000
kill -9 PID_HERE

# For Windows:
netstat -ano | findstr :5000
taskkill /PID PID_HERE /F
```

### Vite Cannot Find Module

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

**Created:** August 18, 2026  
**Duration:** 2-3 days  
**Next Step:** Step 2 - Backend API Setup
