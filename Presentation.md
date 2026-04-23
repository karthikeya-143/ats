# 📊 ATS SCORER - COMPREHENSIVE PROJECT PRESENTATION

## 🎯 PROJECT OVERVIEW

**ATS Scorer** is a full-stack **Resume Analyzer Platform** that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS).

**Core Workflow:**
1. User signs up/logs in
2. Upload resume (PDF/DOCX)
3. System extracts text, analyzes, scores, and provides feedback
4. Display ATS score, keyword matches, formatting feedback, job recommendations
5. Optional: AI-powered insights from OpenAI

---

## 🏗️ TECHNOLOGY STACK

### **Frontend**
- **React 19.2.4** (Modern hooks-based)
- **Vite 8.0.4** (Fast bundler, dev proxy)
- **Tailwind CSS 4.2.2** (Utility-first styling)
- **Framer Motion 12.38.0** (Smooth animations)
- **React Router DOM 7.14.1** (Client-side routing)
- **Recharts 3.8.1** (Interactive pie charts)
- **Lucide React 1.8.0** (SVG icons)
- **Axios 1.15.0** (HTTP client)
- **ESLint + React plugins** (Code quality)

### **Backend**
- **Node.js + Express 5.2.1** (REST API)
- **MongoDB + Mongoose 9.4.1** (Document DB + ODM)
- **JWT (jsonwebtoken 9.0.3)** (Authentication)
- **bcryptjs 3.0.3** (Password hashing)
- **Multer 2.1.1** (File upload handling)
- **pdf-parse 1.1.1** (PDF text extraction)
- **mammoth 1.12.0** (DOCX text extraction)
- **Zod 4.3.6** (Input validation)
- **Helmet 8.1.0** (Security headers)
- **CORS 2.8.6** (Cross-origin requests)
- **Morgan 1.10.1** (HTTP logging)
- **express-rate-limit 8.3.2** (Rate limiting)
- **Nodemon 3.1.14** (Dev auto-reload)
- **Optional:** OpenAI API, Cloudinary

---

## 📂 PROJECT DIRECTORY STRUCTURE

```
ats-scorer/
├── README.md                          # Setup & API docs
├── Presentation.md                    # This file
├── .gitignore                         # Ignore node_modules, .env, dist
├── package-lock.json
│
├── client/                            # React Frontend
│   ├── package.json
│   ├── vite.config.js                 # Vite config + API proxy
│   ├── eslint.config.js               # ESLint rules
│   ├── index.html                     # HTML entry
│   ├── public/                        # Static assets
│   └── src/
│       ├── main.jsx                   # React DOM render
│       ├── App.jsx                    # Main app (ALL pages/routes)
│       ├── index.css                  # Tailwind directives
│       ├── App.css                    # Component styles
│       ├── lib/
│       │   └── api.js                 # Axios instance (baseURL: /api)
│       └── assets/
│           ├── react.svg
│           ├── vite.svg
│           └── hero.png
│
└── server/                            # Express Backend (MVC)
    ├── package.json
    ├── src/
    │   ├── index.js                   # Entry point (DB connect, start server)
    │   ├── app.js                     # Express app setup
    │   │
    │   ├── config/
    │   │   ├── db.js                  # MongoDB connection
    │   │   └── cloudinary.js          # Cloudinary config
    │   │
    │   ├── models/
    │   │   ├── User.js                # Schema: name, email, password
    │   │   └── ResumeReport.js        # Schema: scores, feedback, recommendations
    │   │
    │   ├── controllers/
    │   │   ├── authController.js      # signUp, signIn logic
    │   │   └── resumeController.js    # uploadAndAnalyze, getReports, compareReports
    │   │
    │   ├── routes/
    │   │   ├── authRoutes.js          # POST /signup, /signin
    │   │   └── resumeRoutes.js        # POST /upload, GET /, /compare (protected)
    │   │
    │   ├── middleware/
    │   │   └── authMiddleware.js      # JWT token verification
    │   │
    │   └── services/
    │       ├── resumeParser.js        # extractTextFromBuffer (PDF/DOCX)
    │       ├── atsEngine.js           # scoreResume (scoring algorithm)
    │       ├── recommendationService.js # generateRecommendations (job roles)
    │       └── aiService.js           # generateAIInsights (OpenAI + fallback)
    └── README.md
```

---

## 🗄️ DATABASE SCHEMAS

### **User Collection**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### **ResumeReport Collection**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  originalName: String,
  fileHash: String (SHA256 for duplicate detection),
  fileMimeType: String,
  fileData: Buffer,
  extractedText: String,
  
  // Scores
  atsScore: Number (0-100),
  keywordMatch: Number (%),
  sectionCompleteness: Number (%),
  readability: Number (%),
  
  // Breakdown
  sectionBreakdown: {
    header: Number,
    skills: Number,
    experience: Number,
    projects: Number,
    achievements: Number
  },
  
  // Arrays
  skills: [String],
  missingKeywords: [String],
  limitations: [String],
  improvements: [String],
  actionVerbs: [String],
  
  // AI & Recommendations
  aiExplanation: String,
  jobRecommendations: [
    {
      role: String,
      matchPercent: Number,
      trendingSkills: [String]
    }
  ],
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - { user: 1, createdAt: -1 }
// - { user: 1, fileHash: 1 } (unique)
```

---

## 🔗 API ENDPOINTS DOCUMENTATION

### **Authentication**

#### POST `/api/auth/signup`
Register a new user
```
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

Error (409): { "message": "Email already exists" }
```

#### POST `/api/auth/signin`
Login existing user
```
Request:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

Error (401): { "message": "Invalid credentials" }
```

### **Resume Management** (Protected - requires Bearer token)

#### POST `/api/resumes/upload`
Upload and analyze resume
```
Request:
- Header: Authorization: Bearer <token>
- Form-data: resume (file: PDF or DOCX, max 5MB)

Response (201 new / 200 duplicate):
{
  "_id": "507f1f77bcf86cd799439012",
  "originalName": "resume.pdf",
  "atsScore": 78,
  "keywordMatch": 85,
  "sectionCompleteness": 72,
  "readability": 78,
  "sectionBreakdown": {
    "header": 100,
    "skills": 100,
    "experience": 100,
    "projects": 40,
    "achievements": 30
  },
  "skills": ["react", "node", "mongodb"],
  "missingKeywords": ["kubernetes", "docker"],
  "limitations": ["Experience section is weak or missing."],
  "improvements": [
    "Add role-specific keywords naturally within bullets.",
    "Use quantifiable impact statements (%, time saved, revenue)."
  ],
  "actionVerbs": ["Built", "Led", "Optimized", "Delivered", "Automated", "Designed"],
  "aiExplanation": "Your resume shows strong technical skills...",
  "jobRecommendations": [
    { "role": "Full Stack Developer", "matchPercent": 95, "trendingSkills": [...] },
    { "role": "Frontend Developer", "matchPercent": 88, "trendingSkills": [...] }
  ],
  "duplicate": false,
  "createdAt": "2024-04-23T10:30:00Z"
}

Error (400): { "message": "Resume file is required" }
Error (413): { "message": "File too large" }
```

#### GET `/api/resumes`
Fetch all reports for user
```
Request:
- Header: Authorization: Bearer <token>

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "originalName": "resume.pdf",
    "atsScore": 78,
    ...
  },
  ...
]
(Sorted by createdAt desc, max 30)

Error (401): { "message": "Unauthorized" }
```

#### GET `/api/resumes/compare?ids=id1,id2,id3`
Compare up to 3 reports
```
Request:
- Header: Authorization: Bearer <token>
- Query: ids=507f1f77bcf86cd799439012,507f1f77bcf86cd799439013

Response (200):
[
  { _id: "...", atsScore: 78, keywordMatch: 85, ... },
  { _id: "...", atsScore: 82, keywordMatch: 92, ... }
]

Error (401): { "message": "Unauthorized" }
```

#### GET `/api/health`
Health check
```
Response (200):
{ "ok": true }
```

### **Security Features**
- **Rate Limiting:** 300 requests per 15 minutes on `/api`
- **Helmet:** XSS protection, CSP, HSTS, click-jacking prevention
- **CORS:** Restricted to frontend origin (default: localhost:5173)
- **JWT:** 7-day expiry
- **Input Validation:** Zod schemas on signup/signin
- **File Validation:** MIME type + size limits (PDF/DOCX, 5MB max)

---

## 🧠 ATS SCORING ALGORITHM

### **Scoring Formula**
```
ATS Score = (35% × Keyword Match) + (30% × Section Completeness) 
           + (20% × Readability) + (15% × Formatting)
```

### **Components**

#### 1. **Keyword Match (35%)**
- Searches for 10 core keywords: leadership, communication, react, node, api, project, team, sql, mongodb, testing
- Calculates: (matched keywords / total keywords) × 100
- Provides: `missingKeywords[]` list

#### 2. **Section Completeness (30%)**
Checks for 5 key resume sections:
- **Header (100% or 40%):** Must include email, phone, LinkedIn, GitHub
- **Skills (100% or 35%):** Must have "Skills" section
- **Experience (100% or 30%):** Must have "Experience" or "Work History"
- **Projects (100% or 40%):** Must have "Projects" section
- **Achievements (100% or 30%):** Must have "Achievements" or "Awards"
- Average of all sections = Section Completeness%

#### 3. **Readability (20%)**
- Based on word count: `(word count / 450) × 100`
- Min: 35%, Max: 98%
- Measures content depth/detail

#### 4. **Formatting (15%)**
- Checks for bullet points (•) or dashes (-)
- With formatting: 85%
- Without: 65%

### **Output**
```javascript
{
  atsScore: 78,              // 0-100
  keywordMatch: 85,          // %
  sectionCompleteness: 72,   // %
  readability: 78,           // %
  sectionBreakdown: {...},   // Individual section scores
  missingKeywords: [...],    // Keywords not found
  limitations: [...],        // Issues detected
  improvements: [...],       // Suggestions
  actionVerbs: [...]         // Example action words to use
}
```

---

## 🤖 AI INSIGHTS SERVICE

### **OpenAI Integration**
If `OPENAI_API_KEY` is provided:
- Sends resume score data to **GPT-4o-mini**
- Prompts: Generate explanation + 2 bullet enhancement tips
- Returns: `{ explanation: String, bulletEnhancementTips: [String, String] }`

### **Fallback (No API Key)**
Generic but helpful tips:
```javascript
{
  explanation: "Your ATS score is 78/100. Improve keyword alignment...",
  bulletEnhancementTips: [
    "Start bullets with strong action verbs and include measurable outcomes.",
    "Tailor bullets to match role requirements from the job description."
  ]
}
```

---

## 💼 JOB RECOMMENDATION ENGINE

Maps user's extracted skills to 5 predefined job roles:

| Role | Key Skills |
|------|-----------|
| Frontend Developer | react, javascript, typescript, css, redux |
| Backend Developer | node, express, mongodb, sql, api |
| Full Stack Developer | react, node, mongodb, rest, typescript |
| Data Analyst | python, sql, excel, power bi, tableau |
| DevOps Engineer | docker, kubernetes, aws, ci/cd, linux |

**Algorithm:**
1. Normalize user skills to lowercase
2. For each role, count skill matches
3. Calculate: `matchPercent = (matched skills / total role skills) × 100`
4. Return top 4 roles sorted by match%

---

## 🎨 FRONTEND ARCHITECTURE

### **Pages**

#### 1. **Home Page** (Public)
- Hero section with project description
- Feature cards (keyword matching, format analysis, scoring)
- CTA button: "Upload Resume"
- Responsive grid layout
- Gradient background (purple/indigo theme)

#### 2. **Signup Page** (Public)
- Form: Name, Email, Password
- Input validation (email format, password min 6 chars)
- Error handling
- Link to signin page

#### 3. **Signin Page** (Public)
- Form: Email, Password
- JWT token stored in component state
- Redirect to dashboard on success
- Error messages

#### 4. **Dashboard** (Protected)
**Features:**
- **Upload Zone:** Drag & drop or click to upload PDF/DOCX
  - Real-time feedback: "Uploading...", success/error messages
  - Duplicate detection feedback
- **4 Stat Cards:** ATS Score, Keyword Match%, Section Completeness%, Readability%
  - Animated on load
  - Hover effects
- **Interactive Pie Chart:** Score breakdown
  - Click chart sections to toggle labels
  - **🔥 Rampage Mode:** Aggressive styling with enhanced colors/shadows
  - Smooth animations
- **Resume History:** List of previous uploads (newest first)
- **Compare Tool:** Select up to 3 reports for side-by-side comparison
- **Dark/Light Mode Toggle:** Persists in component state
- **Logout Button**

### **Styling**
- **Tailwind CSS 4.2.2:** Utility-first CSS framework
- **Framer Motion:** Page transitions, hover animations, chart animations
- **Custom Gradients:** Linear/radial gradients for backgrounds
- **Glassmorphism:** Backdrop blur + border glow effect on cards
- **Responsive Design:** Mobile-first, 3-column grid on desktop
- **Dark Mode:** Toggle between purple/indigo and light gray themes

### **State Management**
- **React Hooks:** useState, useEffect, useMemo, useLocation, useNavigate
- **Token Storage:** Component state (lost on refresh—no localStorage)
- **API Integration:** Axios with Bearer token in headers
- **Local UI State:** Form inputs, loading states, error messages

### **Authentication Flow**
1. User enters email + password
2. POST to `/api/auth/signup` or `/api/auth/signin`
3. Backend returns JWT token + user info
4. Store token in `useState`
5. On protected routes, check token → redirect to login if missing
6. Logout clears token + redirects to home

---

## 🚀 SETUP & DEPLOYMENT GUIDE

### **Prerequisites**
- Node.js (v16+)
- MongoDB (local or Atlas)
- (Optional) OpenAI API key
- (Optional) Cloudinary account

### **Backend Setup**
```bash
cd server
npm install

# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/ats-scorer" > .env
echo "JWT_SECRET=your_super_secret_key_here" >> .env
echo "CLIENT_URL=http://localhost:5173" >> .env
# Optional
echo "OPENAI_API_KEY=sk-your-key-here" >> .env
echo "CLOUDINARY_CLOUD_NAME=your-cloud-name" >> .env

# Start development server
npm run dev  # Runs on http://localhost:5000

# Or production
npm start
```

### **Frontend Setup**
```bash
cd client
npm install

# Start development server
npm run dev  # Runs on http://localhost:5173
# Vite automatically proxies /api to http://localhost:5000

# Build for production
npm run build  # Output in client/dist

# Preview production build
npm run preview
```

### **Environment Variables**

**server/.env:**
```
MONGO_URI=mongodb://username:password@cluster.mongodb.net/ats-scorer
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
PORT=5000
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-... (optional)
CLOUDINARY_CLOUD_NAME=... (optional)
CLOUDINARY_API_KEY=... (optional)
CLOUDINARY_API_SECRET=... (optional)
```

**Frontend:**
No .env needed (dev: Vite proxy; prod: CORS from env)

---

## ✨ KEY FEATURES

✅ **User Authentication**
- Signup with email/password
- Password hashing (bcryptjs)
- JWT tokens (7-day expiry)
- Protected routes

✅ **Resume Upload & Parsing**
- PDF text extraction (pdf-parse)
- DOCX text extraction (mammoth)
- File size limit (5MB)
- MIME type validation
- Duplicate detection (SHA256 hash)

✅ **ATS Scoring**
- 4-factor algorithm
- Keyword analysis
- Section completeness check
- Readability metric
- Detailed feedback

✅ **Job Recommendations**
- 5 predefined roles
- Skill matching
- Match percentage
- Trending skills suggestion

✅ **AI Insights** (Optional)
- OpenAI GPT-4o-mini integration
- Fallback generic tips
- Graceful error handling

✅ **Dashboard Analytics**
- Interactive pie chart
- Score breakdown
- Rampage Mode (visual enhancement)
- Resume history
- Report comparison (up to 3)

✅ **User Experience**
- Dark/light mode
- Responsive design
- Smooth animations
- Real-time feedback
- Drag & drop upload

✅ **Security**
- Rate limiting
- Helmet security headers
- CORS protection
- Input validation (Zod)
- JWT authentication
- Bcrypt password hashing

---

## 📊 DEPENDENCIES SUMMARY

### **Frontend (12 dependencies)**
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.14.1",
  "axios": "^1.15.0",
  "tailwindcss": "^4.2.2",
  "@tailwindcss/vite": "^4.2.2",
  "framer-motion": "^12.38.0",
  "recharts": "^3.8.1",
  "lucide-react": "^1.8.0",
  "clsx": "^2.1.1",
  "vite": "^8.0.4",
  "eslint": "^9.39.4"
}
```

### **Backend (17 dependencies)**
```json
{
  "express": "^5.2.1",
  "mongoose": "^9.4.1",
  "jsonwebtoken": "^9.0.3",
  "bcryptjs": "^3.0.3",
  "multer": "^2.1.1",
  "pdf-parse": "^1.1.1",
  "mammoth": "^1.12.0",
  "axios": "^1.15.0",
  "zod": "^4.3.6",
  "cors": "^2.8.6",
  "helmet": "^8.1.0",
  "morgan": "^1.10.1",
  "express-rate-limit": "^8.3.2",
  "dotenv": "^17.4.2",
  "cloudinary": "^2.9.0",
  "uuid": "^13.0.0",
  "nodemon": "^3.1.14"
}
```

---

## 🔒 SECURITY CONSIDERATIONS

- **Never commit `.env` files** to version control
- **Keep JWT_SECRET safe** (regenerate if exposed)
- **Validate file uploads:** MIME type + size limits enforced
- **Use HTTPS in production** (enable CORS appropriately)
- **Rate limit API:** Prevent brute force attacks
- **Hash passwords:** bcryptjs with salt rounds 10
- **SQL/NoSQL injection:** Mongoose + Zod validation protect against it
- **XSS protection:** Helmet + React's built-in escaping
- **CSRF tokens:** Consider adding in production

---

## 📝 WORKFLOW DIAGRAM

```
User Signup
    ↓
[Email, Password] → Backend → Hash password → Save User → JWT token
    ↓
User Signin
    ↓
[Email, Password] → Backend → Verify → JWT token
    ↓
User Uploads Resume
    ↓
[PDF/DOCX file] → Multer → Parse text → ATS Engine
    ↓
Scoring Calculation
    ↓
Keyword Match + Section Check + Readability + Formatting
    ↓
Generate Recommendations (Job Roles)
    ↓
OpenAI Insights (if API key available)
    ↓
Save to MongoDB
    ↓
Return Report to Frontend
    ↓
Display Dashboard with Charts + Feedback
```

---

## 🎯 USE CASES

1. **Job Seekers:** Optimize resumes before applying to jobs
2. **Career Coaches:** Provide clients with ATS analysis
3. **HR Teams:** Validate resume quality
4. **Educational Institutes:** Train students on resume best practices

---

## 🔄 FUTURE ENHANCEMENTS

- [ ] Vector database for semantic resume search
- [ ] Multiple resume format templates
- [ ] Real-time collaboration (multiple users)
- [ ] Batch resume analysis
- [ ] Resume versioning & A/B testing
- [ ] Integration with job boards (LinkedIn, Indeed)
- [ ] Mobile app (React Native)
- [ ] Premium features (advanced AI insights, API access)
- [ ] Webhook integrations
- [ ] Advanced analytics dashboard

---

**Last Updated:** April 23, 2026  
**Version:** 1.0.0  
**Status:** Production-Ready ✅
