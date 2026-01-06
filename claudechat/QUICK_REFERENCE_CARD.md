# Math Practice App - Quick Reference Card

## PROJECT FOLDER STRUCTURE

```
MathApp/
├── server/                    ← Backend (Node.js + Express)
│   ├── models/               ← Database schemas
│   ├── controllers/          ← Business logic
│   ├── routes/               ← API endpoints
│   ├── services/             ← Claude API calls
│   ├── middleware/           ← Auth verification
│   ├── config/               ← Database setup
│   ├── .env                  ← Secrets (never share!)
│   ├── server.js             ← Main server file
│   └── package.json
│
├── client/                    ← Frontend (React)
│   ├── src/
│   │   ├── components/       ← React components
│   │   ├── pages/            ← Full pages (Login, Practice, Stats)
│   │   ├── services/         ← API communication
│   │   ├── hooks/            ← Custom React hooks
│   │   ├── App.jsx           ← Main app
│   │   └── main.jsx          ← Entry point
│   ├── .env                  ← Frontend config
│   ├── package.json
│   └── vite.config.js        ← Build config
```

---

## ESSENTIAL COMMANDS

### Starting the App

```bash
# Terminal 1: Start Backend
cd server
npm run dev
# Output: Server running on port 5000

# Terminal 2: Start Frontend  
cd client
npm run dev
# Output: ➜  Local: http://localhost:5173
```

### Installing Dependencies

```bash
# In server folder
npm install express dotenv cors mongoose bcryptjs jsonwebtoken @anthropic-ai/sdk

# In client folder
npm install axios react-router-dom react-sketch-canvas -D tailwindcss
```

### Creating Files

```bash
# Create .env files
touch server/.env
touch client/.env

# Create folders
mkdir -p server/models server/controllers server/routes server/services
mkdir -p client/src/{components,pages,services,hooks}
```

### Testing Backend Endpoints

```bash
# Test with curl
curl http://localhost:5000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'

# Or use Postman: https://www.postman.com/downloads/
```

---

## ENVIRONMENT VARIABLES

### server/.env (Backend Secrets)

```
# Database
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/mathdb

# API Keys
CLAUDE_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXX

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_random_string_here_12345
```

### client/.env (Frontend Config)

```
VITE_API_URL=http://localhost:5000/api
```

---

## API ENDPOINTS (What Gets Built)

### Authentication
```
POST   /api/auth/register          → Create new user
POST   /api/auth/login             → Login & get token
POST   /api/auth/me                → Get current user
```

### Problems
```
GET    /api/problems/random        → Get random problem
GET    /api/problems/:id           → Get specific problem
POST   /api/problems/seed          → Populate with sample data
```

### Attempts & Feedback
```
POST   /api/attempts/:problemId/submit    → Submit answer
POST   /api/attempts/:problemId/hint      → Request hint
```

### Progress
```
GET    /api/progress/dashboard     → Get stats
GET    /api/progress/history       → Get attempt history
GET    /api/progress/streak        → Get current streak
```

---

## PAGE STRUCTURE (What Users See)

```
/                    ← Home/Dashboard (not yet built)
/login               ← Login page (Phase 1)
/register            ← Register page (Phase 1)
/practice            ← Main practice page (Phase 2+)
/stats               ← Progress dashboard (Phase 5)
/settings            ← User preferences (future)
```

---

## KEY LIBRARIES & WHAT THEY DO

### Backend
| Library | Purpose |
|---------|---------|
| `express` | Web server framework |
| `mongoose` | MongoDB database helper |
| `bcryptjs` | Encrypt passwords |
| `jsonwebtoken` | Create login tokens |
| `dotenv` | Load .env variables |
| `cors` | Allow frontend to connect |
| `@anthropic-ai/sdk` | Talk to Claude AI |

### Frontend
| Library | Purpose |
|---------|---------|
| `react` | UI framework |
| `react-router-dom` | Navigation between pages |
| `axios` | HTTP requests to backend |
| `react-sketch-canvas` | Drawing/stylus support |
| `tailwindcss` | CSS styling |
| `recharts` | Charts for statistics |

---

## DEBUGGING TIPS

### Check Backend Logs
```bash
# Terminal running server should show:
# GET /api/problems/random
# POST /api/auth/login 200
# [Error messages appear in red]
```

### Check Frontend Errors
```bash
# In browser:
# 1. Right-click → Inspect
# 2. Click "Console" tab
# 3. Look for red error messages
# 4. Check "Network" tab to see API calls
```

### Test Database Connection
```bash
# Make sure MongoDB Atlas is running:
# 1. Go to https://cloud.mongodb.com
# 2. Check your cluster is "Running"
# 3. Verify IP whitelist includes your computer
```

### Test Claude API Key
```bash
# In any JavaScript file:
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic();
console.log('API Key:', process.env.CLAUDE_API_KEY ? 'Loaded' : 'Missing');
```

---

## COMMON ERRORS & FIXES

| Error | Fix |
|-------|-----|
| `EADDRINUSE: Port 5000 in use` | Change PORT in .env or run `lsof -ti:5000 \| xargs kill -9` |
| `MongooseError: Cannot connect` | Check MONGODB_URI is correct, IP whitelist |
| `Cannot find module 'express'` | Run `npm install` in server folder |
| `Uncaught TypeError: Cannot read property` | Check data is loaded before using it |
| `CORS error in browser` | Add frontend URL to CORS in server.js |
| `JWT token expired` | User needs to login again |
| `Claude API error 401` | Check CLAUDE_API_KEY is correct |

---

## FILE SIZES (Expected)

After all phases are built:
- Server code: ~50-75 KB
- Client code: ~40-60 KB
- node_modules: 300+ MB (don't put on GitHub!)

---

## GIT COMMANDS (If Using GitHub)

```bash
# Initialize git (once)
git init

# Create .gitignore
echo "node_modules/\n.env\ndist/\n.DS_Store" > .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit: Math practice app setup"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/math-app.git
git branch -M main
git push -u origin main
```

---

## TESTING WITH SAMPLE DATA

### Register a Test Account
```
Username: testuser
Email: test@example.com
Password: Test123!@
```

### Test Problem
```
Problem: Solve for x: 3x + 5 = 20
Correct Answer: 5
Also Accept: x = 5, 5.0
```

### Expected Workflow
1. Register account
2. Get redirected to /practice
3. See random problem
4. Submit answer "5"
5. See "Correct!" from Claude
6. Click "Next Problem"
7. Repeat

---

## PERFORMANCE TIPS

- Minimize Claude API calls (cache results in database)
- Use Haiku model for simple tasks (faster + cheaper)
- Use Sonnet model for complex tasks (better quality)
- Store hints in database instead of generating repeatedly
- Optimize images (JPG smaller than PNG)
- Use React.memo() to prevent unnecessary re-renders

---

## SECURITY CHECKLIST

- [ ] Never put .env file on GitHub
- [ ] Never log API keys in console
- [ ] Hash passwords with bcryptjs
- [ ] Verify JWT tokens on protected routes
- [ ] CORS configured to allow only your frontend
- [ ] Input validation on all API endpoints
- [ ] No sensitive data in localStorage
- [ ] HTTPS in production (enforced)

---

## USEFUL LINKS

- **Node.js:** https://nodejs.org/
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **MongoDB Docs:** https://docs.mongodb.com/
- **Claude API:** https://docs.anthropic.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Vite:** https://vitejs.dev/
- **Postman:** https://www.postman.com/ (for testing APIs)
- **MongoDB Atlas:** https://cloud.mongodb.com/

---

## PHASE QUICK REFERENCE

| Phase | Time | Main Goal | Key Files |
|-------|------|-----------|-----------|
| 1 | 3-4h | Auth | User model, login/register routes |
| 2 | 4-5h | Problems + Claude | Problem model, answer validation |
| 3 | 3-4h | Hints | Hint generation, feedback UI |
| 4 | 3-4h | Drawing | Canvas component, stylus support |
| 5 | 3-4h | Progress | Attempt tracking, dashboard |
| 6 | 2-3h | Deploy | Render, Vercel setup |

**Total Time: 20-25 hours for one developer**

---

## ASKING FOR HELP

When asking Claude or for debugging help, include:
1. Which phase you're on
2. What you're trying to do
3. The exact error message
4. What you've already tried

Example:
> "Phase 2: Trying to submit an answer. Getting error: 'Cannot read property isCorrect of undefined'. I checked the backend returns the right format."

---

**Save this reference card! You'll use it constantly while building.**
