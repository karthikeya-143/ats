# ATS Resume Scorer (Full Stack)

Production-style ATS Resume Scorer platform with authentication, resume upload/parsing, ATS scoring, feedback, recommendations, and analytics dashboard.

## Stack
- Frontend: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, multer, pdf-parse, mammoth

## Project Structure
- `client` - React web app
- `server` - Express API (MVC-like separation: routes/controllers/models/services)

## Setup
1. Install dependencies:
   - `cd client && npm install`
   - `cd ../server && npm install`
2. Create env:
   - Copy `server/.env.example` to `server/.env`
   - Add your `MONGO_URI`, `JWT_SECRET`, optional `OPENAI_API_KEY`
3. Start backend:
   - `cd server && npm run dev`
4. Start frontend:
   - `cd client && npm run dev`

## API Overview

### Auth
- `POST /api/auth/signup`
  - body: `{ "name": "John", "email": "john@mail.com", "password": "secret123" }`
- `POST /api/auth/signin`
  - body: `{ "email": "john@mail.com", "password": "secret123" }`

### Resume
- `POST /api/resumes/upload` (protected)
  - form-data: `resume` file (`.pdf` or `.docx`, max 5MB)
- `GET /api/resumes` (protected)
  - returns previous reports/history
- `GET /api/resumes/compare?ids=id1,id2` (protected)
  - compare up to 3 reports

## Delivered Features
- JWT auth with hashed passwords
- Resume upload, duplicate detection via file hash
- Resume file and report data stored in MongoDB
- PDF/DOCX text extraction
- ATS scoring: keyword match, formatting signal, section presence, readability
- Detailed feedback: limitations, improvements, missing keywords, action verbs
- Job recommendation + skill trend hints
- Dashboard analytics cards, upload, history, dark/light mode toggle
- AI insight integration fallback (works without key; upgrades with OpenAI key)

## Security Notes
- Never commit real secrets to source files
- Keep Mongo URI and JWT secret only in env files
- Input validation with Zod + auth middleware + upload size/type limits

- fixing the Dashboard UI and some skill Analytics
