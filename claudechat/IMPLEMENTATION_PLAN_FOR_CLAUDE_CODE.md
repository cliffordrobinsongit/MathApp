# Math Practice App - Implementation Plan for Claude Code
## Structured Phases for Code Generation

This document breaks down the math practice app into phases that Claude Code can implement incrementally. Each phase builds on the previous one.

---

## HOW TO USE THIS DOCUMENT WITH CLAUDE CODE

1. Read the phase completely
2. Copy the "CLAUDE CODE PROMPT" from the phase
3. Paste it into Claude Code (or use `claude code` in terminal)
4. Claude will generate all the code files for that phase
5. Move files to your project
6. Test everything works
7. Move to next phase

---

## PHASE 1: BASIC SETUP AND AUTHENTICATION

**Goal:** Create working backend server, MongoDB connection, and basic React app with login/register system

**Estimated Time:** 3-4 hours

**What Gets Built:**
- Express server with MongoDB connection
- User model and authentication routes
- JWT token generation
- Basic React login/register pages
- API service to connect frontend to backend
- Password hashing and security

**Prerequisites:**
- All software installed (see SETUP_GUIDE_FOR_NEW_CODERS.md)
- .env files created with API keys
- Both server and client folders initialized

### Files This Phase Creates

**Backend:**
- `server/models/User.js` - User database schema
- `server/middleware/auth.js` - Verify JWT tokens
- `server/controllers/authController.js` - Login/register logic
- `server/routes/auth.js` - Auth endpoints
- `server/config/db.js` - MongoDB connection
- `server/server.js` - Main server file

**Frontend:**
- `client/src/services/api.js` - API communication setup
- `client/src/services/auth.js` - Auth token management
- `client/src/pages/Login.jsx` - Login page
- `client/src/pages/Register.jsx` - Register page
- `client/src/App.jsx` - Main app structure

### CLAUDE CODE PROMPT FOR PHASE 1

```
I'm building a MERN stack math practice app. I'm in Phase 1: Basic Setup and Authentication.

Here's what I need:

BACKEND (Node.js + Express + MongoDB):
1. Create server/models/User.js with:
   - Schema: username (unique), email (unique), password (hashed), createdAt
   - Use bcryptjs to hash passwords
   - Include comparePassword method

2. Create server/config/db.js with:
   - MongoDB Atlas connection using mongoose
   - Connection error handling
   - Log connection status

3. Create server/middleware/auth.js with:
   - Verify JWT tokens
   - Extract user ID from token
   - Pass user to next middleware

4. Create server/controllers/authController.js with:
   - register() - Hash password, create user, return token
   - login() - Find user, verify password, return token
   - Error handling for duplicate emails/usernames

5. Create server/routes/auth.js with:
   - POST /register
   - POST /login
   - POST /me (get current user from token)

6. Update server/server.js with:
   - Express server setup
   - CORS configuration for localhost:5173
   - MongoDB connection
   - Routes mounting
   - Error handling middleware
   - Listen on PORT from .env

FRONTEND (React):
1. Create client/src/services/api.js with:
   - Axios instance pointing to VITE_API_URL
   - Auto-attach JWT token to all requests
   - Request/response interceptors

2. Create client/src/services/auth.js with:
   - registerUser(username, email, password)
   - loginUser(email, password)
   - saveToken(token)
   - getToken()
   - clearToken()
   - isAuthenticated()

3. Create client/src/pages/Register.jsx with:
   - Form for username, email, password
   - Email validation
   - Password confirmation
   - Submit to /api/auth/register
   - On success: save token, redirect to /practice
   - Show error messages

4. Create client/src/pages/Login.jsx with:
   - Form for email, password
   - Submit to /api/auth/login
   - On success: save token, redirect to /practice
   - Show error messages
   - Link to register page

5. Create client/src/App.jsx with:
   - Router setup
   - Route to /login and /register
   - Protected routes (require authentication)
   - Redirect unauthenticated users to login

Use:
- Node.js 18+, Express 4.x, Mongoose 7.x, jsonwebtoken, bcryptjs
- React 18+, React Router v6, Axios
- .env files for MONGODB_URI and CLAUDE_API_KEY

Make code production-ready with error handling. Use descriptive variable names.
```

### Testing Phase 1

After Claude Code generates the files:

```bash
# Test Backend
cd server
npm run dev
# Should see: "Server running on port 5000"
# Should see: "Connected to MongoDB"

# In another terminal, test frontend
cd client
npm run dev
# Should see: "http://localhost:5173"

# Test in browser:
# 1. Go to http://localhost:5173
# 2. Click register
# 3. Create account (username, email, password)
# 4. Should redirect to /practice (or /login if route not yet built)
# 5. Close and reopen - check if logged in (using stored token)
```

### Next: Move to Phase 2

Once Phase 1 is working, proceed to Phase 2.

---

## PHASE 2: PROBLEMS AND CLAUDE INTEGRATION

**Goal:** Create problem system and integrate Claude API for answer validation and feedback

**Estimated Time:** 4-5 hours

**What Gets Built:**
- Problem model with sample data
- API endpoints to fetch problems
- Claude Service to validate answers
- Feedback generation from Claude
- Basic problem display page

**Prerequisites:**
- Phase 1 completely working
- Claude API key verified in .env
- MongoDB connected

### Files This Phase Creates

**Backend:**
- `server/models/Problem.js` - Problem database schema
- `server/controllers/problemController.js` - Get problems logic
- `server/routes/problems.js` - Problem endpoints
- `server/services/claudeService.js` - Claude API integration
- `server/utils/problemData.js` - Sample problems to seed database

**Frontend:**
- `client/src/pages/Practice.jsx` - Main practice page
- `client/src/components/ProblemDisplay.jsx` - Show problem
- `client/src/components/TextInput.jsx` - Text answer input
- `client/src/hooks/useProblem.js` - Fetch and manage problems

### CLAUDE CODE PROMPT FOR PHASE 2

```
PHASE 2: Problems and Claude Integration

I need code to:

BACKEND:
1. Create server/models/Problem.js with schema:
   - title: "Problem name"
   - category: "algebra" | "pre-algebra"
   - subcategory: "linear-equations" etc
   - difficulty: "pre-algebra" | "algebra-1" | "algebra-2"
   - problemText: "Solve: 3x + 5 = 20"
   - answerFormat: "number" | "expression"
   - correctAnswer: "5"
   - alternateAnswers: ["x = 5"]
   - createdAt

2. Create server/utils/problemData.js with:
   - Array of 20 sample pre-algebra and algebra problems
   - Include: linear equations, two-step equations, basic polynomials
   - Each problem has all fields from Problem schema

3. Create server/controllers/problemController.js with:
   - getRandom() - Get random problem
   - getById(id) - Get specific problem
   - seed() - Populate database with sample problems (call once)

4. Create server/routes/problems.js with:
   - GET /random - Get random problem
   - GET /:id - Get problem by ID
   - POST /seed - Seed database (development only)

5. Create server/services/claudeService.js with:
   - validateAnswer(problemText, studentAnswer, correctAnswer)
     * Use Claude to check if answer is correct
     * Handle minor notation differences
     * Return: { isCorrect: boolean, reasoning: string }
   - generateFeedback(problemText, studentAnswer, isCorrect)
     * Generate 1-2 sentence feedback
     * If correct: Praise and encourage
     * If wrong: Point out the issue without giving answer
     * Return: { feedback: string }
   - Use Claude Haiku model for cost efficiency

6. Update server/controllers/attemptController.js:
   - submitAnswer(req, res) with:
     * Receive: { problemId, studentAnswer, attemptNumber }
     * Validate answer using claudeService
     * Generate feedback
     * Return: { isCorrect, feedback, nextStep }

7. Update server/routes/ to mount:
   - /api/problems - problem routes
   - /api/attempts - attempt routes (scaffold for phase 3)

FRONTEND:
1. Create client/src/components/ProblemDisplay.jsx:
   - Shows problem title and problem text
   - Shows attempt counter
   - Props: problem, attemptNumber

2. Create client/src/components/TextInput.jsx:
   - Text input field for answer
   - Submit button
   - Disabled while submitting
   - Props: onSubmit(answer), loading, disabled

3. Create client/src/hooks/useProblem.js custom hook:
   - fetchRandomProblem() - GET /api/problems/random
   - submitAnswer(problemId, answer, attemptNumber)
   - Returns: { problem, loading, error, submitAnswer }

4. Create client/src/pages/Practice.jsx:
   - Use useProblem hook
   - Display ProblemDisplay + TextInput
   - On submit: Show if correct or incorrect
   - If correct: "Next Problem" button
   - If incorrect: "Try Again" button
   - Button that will launch HintSystem (Phase 3)

5. Update client/src/App.jsx:
   - Add route for /practice
   - Make it protected (requires auth)
   - Redirect /login to /practice if authenticated

Test by:
- Login to app
- See random problem appear
- Enter answer
- See Claude feedback appear
- Can click "Next Problem"
```

### Testing Phase 2

```bash
# Seed problems into database (run once):
curl http://localhost:5000/api/problems/seed

# Then test in browser:
# 1. Login
# 2. See problem on Practice page
# 3. Type answer (e.g., for "3x + 5 = 20" answer "5")
# 4. Click "Check Answer"
# 5. See "Correct!" message with Claude feedback
# 6. Try again with wrong answer
# 7. See feedback explaining issue
```

---

## PHASE 3: HINT SYSTEM AND FEEDBACK PANELS

**Goal:** Build progressive hint system (steps only → steps with solution) and polish UI

**Estimated Time:** 3-4 hours

**What Gets Built:**
- Progressive hint display
- Complete solution display
- Feedback panel component
- Better problem navigation

### Files This Phase Creates

**Backend:**
- Update `server/models/Problem.js` - Add hints and solutions fields
- `server/services/claudeService.js` - Add generateSteps() and generateSolution()
- `server/controllers/attemptController.js` - Update with hint endpoints

**Frontend:**
- `client/src/components/HintSystem.jsx` - Progressive hints
- `client/src/components/FeedbackPanel.jsx` - Result display
- Update `client/src/pages/Practice.jsx` - Integrate hints and feedback
- `client/src/hooks/useAttempt.js` - Track attempts and hints

### CLAUDE CODE PROMPT FOR PHASE 3

```
PHASE 3: Hints and Feedback System

BACKEND:
1. Update server/models/Problem.js to add:
   - hints: [{ level: "steps", content: "..." }, { level: "solution", content: "..." }]
   - explanation: "Full worked solution"

2. Update server/services/claudeService.js to add:
   - generateSteps(problemText, difficulty)
     * Generate 3-4 steps to solve problem
     * Do NOT include final answer
     * Format as numbered list
     * Return: { steps: ["Step 1: ...", "Step 2: ..."] }
   - generateSolution(problemText, difficulty)
     * Full step-by-step solution
     * Include final answer clearly
     * Explain each step
     * Return: { solution: "Step 1: ... This gives us ... " }

3. Update server/controllers/problemController.js:
   - When seeding, call generateSteps and generateSolution for each problem
   - Cache these in database to avoid repeated Claude calls

4. Create server/routes/attempts.js with:
   - POST /:problemId/submit - Submit answer
   - POST /:problemId/hint?level=steps - Get hints only
   - POST /:problemId/hint?level=solution - Get hints + solution

5. Update server/controllers/attemptController.js:
   - getHint(problemId, level) - Return cached hints
   - Respond with { hint: string, nextStep: "TRY_AGAIN" | "REVEAL_SOLUTION" }

FRONTEND:
1. Create client/src/components/HintSystem.jsx:
   - Initially shows "Show Hint" button
   - First click: Show "Steps" (no answer)
   - Second click: Show "Steps & Solution"
   - Third click: Full explanation
   - Use accordion or tabs to show/hide
   - Props: problemId, attemptNumber, onHintRequested

2. Create client/src/components/FeedbackPanel.jsx:
   - Shows result: "Correct!" or "Not quite..."
   - Shows feedback message
   - Shows buttons:
     * If correct: "Next Problem"
     * If incorrect on attempt 1: "Try Again" and "Show Hint"
     * If incorrect on attempt 2: "Next Problem" and "Show Solution"
   - Props: isCorrect, feedback, attemptNumber, onNext, onHint, onSolution

3. Create client/src/hooks/useAttempt.js:
   - trackAttempts() - Keep count of attempts
   - submitAnswer() - Call backend
   - requestHint(level) - Get hints from backend
   - Returns: { attempts, isCorrect, feedback, hint, solution, ... }

4. Update client/src/pages/Practice.jsx:
   - Use useAttempt hook
   - Show ProblemDisplay
   - Show TextInput (disabled if solved)
   - After submit:
     * Show FeedbackPanel with result
     * If wrong: Enable HintSystem
     * Second attempt wrong: Auto-show solution
   - Flow:
     * Attempt 1 wrong → Show "Try Again" + "Show Hint"
     * Attempt 2 wrong → Show "Show Solution" button
     * Click solution → Show full worked answer
     * Any correct → Show "Next Problem"

Design with Tailwind CSS for nice appearance.
```

### Testing Phase 3

```bash
# In Practice page:
# 1. See problem
# 2. Enter wrong answer
# 3. See "Not quite right" feedback + "Try Again" button
# 4. Click "Show Hint" - see steps only
# 5. Try different wrong answer
# 6. See "Show Solution" button
# 7. Click it - see full worked solution
# 8. Enter correct answer or click "Next Problem"
```

---

## PHASE 4: DRAWING CANVAS AND STYLUS SUPPORT

**Goal:** Add drawing canvas for stylus/tablet input

**Estimated Time:** 3-4 hours

**What Gets Built:**
- Canvas drawing component
- Stylus and touch support
- Eraser, undo, redo, clear
- Drawing submission
- Drawing → text conversion (OCR)

### Files This Phase Creates

**Backend:**
- `server/services/handwritingService.js` - OCR service for drawings

**Frontend:**
- `client/src/components/DrawingCanvas.jsx` - Canvas implementation
- `client/src/components/InputMethods.jsx` - Toggle between typing and drawing
- Update `client/src/pages/Practice.jsx` - Integrate drawing

### CLAUDE CODE PROMPT FOR PHASE 4

```
PHASE 4: Drawing Canvas and Stylus Support

BACKEND:
1. Create server/services/handwritingService.js:
   - extractTextFromImage(base64ImageData)
     * Use Claude Vision API to extract text from drawn image
     * Return: { extractedText: string, confidence: number }
   - Support for base64 encoded images

2. Update server/controllers/attemptController.js:
   - Handle both text and drawn answers
   - If drawn: Call handwritingService to extract text first
   - Then validate extracted text

FRONTEND:
1. Create client/src/components/DrawingCanvas.jsx:
   - Uses react-sketch-canvas library
   - Features:
     * Brush color picker (black default)
     * Brush size slider (1-10px)
     * Eraser tool
     * Undo button
     * Redo button
     * Clear all button
     * Export to PNG button
   - Touch/stylus support on tablets and touchscreen laptops
   - Props: onSubmit(imageData), disabled
   - Return: Canvas component with toolbar

2. Create client/src/components/InputMethods.jsx:
   - Tabbed interface:
     * Tab 1: "Type Your Answer" → TextInput component
     * Tab 2: "Draw Your Answer" → DrawingCanvas component
   - Switch between tabs
   - Submit button works for both input types
   - Props: problemId, attemptNumber, onSubmit, loading

3. Update client/src/pages/Practice.jsx:
   - Replace TextInput with InputMethods component
   - Handle both text and image submissions
   - Show which input method was used
   - Pass drawing image to backend for OCR if needed

4. Create client/src/hooks/useCanvas.js:
   - Canvas state management
   - Export drawing as base64 image
   - Clear canvas
   - Returns: { canvasRef, exportImage, clear, ... }

Style with Tailwind. Make sure canvas is tablet-friendly.
```

### Testing Phase 4

```bash
# Test on desktop:
# 1. Practice page loads
# 2. See two tabs: "Type" and "Draw"
# 3. Click "Draw" tab
# 4. Canvas appears
# 5. Draw answer with mouse
# 6. Use eraser, undo, etc.
# 7. Click submit - image sent to backend
# 8. Claude extracts text and validates

# Test on tablet:
# 1. Same as above but with stylus
# 2. Touch support works
# 3. Pressure sensitivity (if device supports it)
```

---

## PHASE 5: PROGRESS TRACKING AND DASHBOARD

**Goal:** Track student progress and show statistics

**Estimated Time:** 3-4 hours

**What Gets Built:**
- Progress dashboard
- Attempt history
- Streak counter
- Performance by topic
- Stats page

### Files This Phase Creates

**Backend:**
- `server/models/Attempt.js` - Attempt/submission history
- `server/controllers/progressController.js` - Stats generation
- `server/routes/progress.js` - Progress endpoints

**Frontend:**
- `client/src/pages/Stats.jsx` - Dashboard page
- `client/src/components/ProgressChart.jsx` - Visual stats
- `client/src/components/StreakCounter.jsx` - Streak display

### CLAUDE CODE PROMPT FOR PHASE 5

```
PHASE 5: Progress Tracking and Dashboard

BACKEND:
1. Create server/models/Attempt.js with:
   - userId
   - problemId
   - studentAnswer
   - isCorrect: boolean
   - attemptNumber: 1 | 2 | 3
   - hintsUsed: number
   - inputMethod: "text" | "handwritten"
   - createdAt

2. Create server/controllers/progressController.js:
   - getDashboard(userId) - Overall stats
     * Total problems solved
     * Current streak
     * Accuracy %
     * Problems by difficulty
     * Topics practiced
   - getHistory(userId, limit) - Last N attempts
   - getStreakCount(userId) - Current streak
   - getTopicStats(userId) - Breakdown by topic

3. Create server/routes/progress.js:
   - GET /dashboard - User stats
   - GET /history - Attempt history
   - GET /streak - Current streak

4. Update server/controllers/attemptController.js:
   - After saving attempt, also update streak
   - Correct answer: streak++
   - Incorrect: streak reset to 0

FRONTEND:
1. Create client/src/pages/Stats.jsx:
   - Overall statistics card
   - Current streak display (big and prominent)
   - Accuracy percentage
   - Total problems solved
   - Recent attempts table
   - Performance by difficulty (bar chart)

2. Create client/src/components/StreakCounter.jsx:
   - Shows current streak
   - Big number display
   - Fire emoji or flame icon
   - Shows "Days in a row" or "Problems in a row"

3. Create client/src/components/ProgressChart.jsx:
   - Use recharts for visualization
   - Show:
     * Accuracy over time
     * Problems solved per day
     * Performance by topic

4. Update client/src/pages/Practice.jsx:
   - Show streak counter in header
   - Update after each correct answer
   - Show in modal/popup for correct answers

5. Create client/src/hooks/useProgress.js:
   - fetchDashboard()
   - fetchHistory()
   - getStreak()
   - Returns: { stats, history, loading, error }

6. Update client/src/App.jsx:
   - Add /stats route
   - Add link to stats in navigation

Use recharts library for charts. Make visuals engaging to motivate students.
```

### Testing Phase 5

```bash
# Test Stats page:
# 1. Solve several problems
# 2. Some correct, some wrong
# 3. Visit /stats page
# 4. See streak, accuracy, breakdown by topic
# 5. See recent attempts history
# 6. Streak resets if you get one wrong
```

---

## PHASE 6: DEPLOYMENT AND PRODUCTION

**Goal:** Deploy to production so it works on real servers

**Estimated Time:** 2-3 hours

### Deployment Options

**Backend Deployment:**
- Render.com (easy, free tier)
- Railway.app
- Heroku

**Frontend Deployment:**
- Vercel (React + Vite optimized)
- Netlify
- GitHub Pages

**Database:**
- MongoDB Atlas (cloud) - already using this

### CLAUDE CODE PROMPT FOR PHASE 6

```
PHASE 6: Deployment

I need to deploy my MERN app:

BACKEND:
1. Create server/.gitignore:
   - node_modules/
   - .env
   - *.log

2. Create server/Procfile for Heroku/Render (if needed)

3. Update server/package.json:
   - Add "engines": { "node": "18.x" }
   - Add start script for production

4. Ensure environment variables are production-ready:
   - MONGODB_URI points to Atlas
   - CLAUDE_API_KEY is set
   - NODE_ENV=production
   - CORS allows frontend domain

FRONTEND:
1. Create client/.gitignore:
   - node_modules/
   - dist/
   - .env.local

2. Build script for production:
   - npm run build creates optimized dist/ folder

3. Create client/.env.production:
   - VITE_API_URL=https://yourbackend.com/api
   - (Not localhost!)

4. Configure Vercel/Netlify to:
   - npm install
   - npm run build
   - Serve from dist/ folder

OPTIONAL:
1. Add .nvmrc file in root with Node version
2. Add GitHub Actions for CI/CD
3. Set up environment variables in deployment platforms
```

---

## SUMMARY: HOW TO PROCEED

1. **Read SETUP_GUIDE_FOR_NEW_CODERS.md** - Install all software
2. **Phase 1** - Copy prompt, use Claude Code, test authentication
3. **Phase 2** - Copy prompt, generate problems + Claude integration
4. **Phase 3** - Copy prompt, build hint system
5. **Phase 4** - Copy prompt, add drawing canvas
6. **Phase 5** - Copy prompt, add progress tracking
7. **Phase 6** - Copy prompt, deploy to production

Each phase takes 3-5 hours. Total project time: 3-4 weeks for one person.

---

## TESTING CHECKLIST FOR EACH PHASE

### After Each Phase:

- [ ] No console errors
- [ ] No network errors (check browser dev tools)
- [ ] Backend API calls work (test with Postman or curl)
- [ ] Frontend loads without crashes
- [ ] Can interact with all new components
- [ ] Data persists in database
- [ ] Claude API is being called correctly

### Before Deployment:

- [ ] All phases working together
- [ ] Test on mobile/tablet if possible
- [ ] Check responsiveness with browser dev tools
- [ ] Verify error handling (what happens on network error)
- [ ] Test with real student users if possible
- [ ] Performance is acceptable (page load time)
- [ ] Security: No API keys exposed in frontend code

---

## COMMON ISSUES AND FIXES

| Issue | Solution |
|-------|----------|
| Claude API errors | Check API key, verify in console.anthropic.com |
| MongoDB connection fails | Check MONGODB_URI, IP whitelist in Atlas |
| CORS errors | Check CORS configuration in server.js matches frontend URL |
| Port already in use | Change PORT in .env or kill existing process |
| Dependencies missing | Run `npm install` in correct folder |
| Frontend can't find backend | Check VITE_API_URL in .env |
| Images not loading | Check file paths are absolute |
| Buttons don't work | Check console for JavaScript errors |

---

**You're ready! Start with Phase 1 and build incrementally. Good luck!**
