# Math Practice App - Development Plan
## MERN Stack + Claude API Integration

---

## 1. PROJECT OVERVIEW

**Goal:** Build an interactive web app that helps students practice pre-Algebra and Algebra problems with AI-powered guided learning.

**Key Features:**
- Problem generation and presentation
- Multiple input methods (typing + stylus/drawing)
- Progressive hint system (steps without solution → steps with solution)
- AI-powered feedback and explanations via Claude API
- Student progress tracking
- Problem difficulty levels

**Tech Stack:**
- **Frontend:** React (with Tailwind CSS)
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Drawing:** React Canvas Drawing Library (e.g., `react-sketch-canvas` or `canvas-draw-react`)
- **AI:** Anthropic Claude API
- **Other:** JWT for auth, dotenv for config

---

## 2. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────┐
│         Client (React + Canvas)         │
│  - Problem Display                      │
│  - Input Methods (Type + Draw)          │
│  - Hint System UI                       │
│  - Progress Dashboard                   │
└──────────────────┬──────────────────────┘
                   │ API Calls (REST/JSON)
                   ↓
┌─────────────────────────────────────────┐
│      Backend (Node.js + Express)        │
│  - Problem Generator/Manager            │
│  - Claude API Integration               │
│  - Session Management                   │
│  - Progress Tracking                    │
└──────────────────┬──────────────────────┘
                   │ Read/Write
                   ↓
┌─────────────────────────────────────────┐
│      Database (MongoDB)                 │
│  - Users & Authentication               │
│  - Problem Bank                         │
│  - Student Attempts & Progress          │
│  - Settings & Preferences               │
└─────────────────────────────────────────┘
```

---

## 3. BACKEND STRUCTURE

### 3.1 Directory Layout
```
server/
├── config/
│   └── db.js                    # MongoDB connection
├── middleware/
│   ├── auth.js                  # JWT verification
│   └── errorHandler.js          # Global error handling
├── models/
│   ├── User.js                  # User schema
│   ├── Problem.js               # Problem schema
│   └── Attempt.js               # Student attempt schema
├── routes/
│   ├── auth.js                  # Auth endpoints
│   ├── problems.js              # Problem endpoints
│   └── attempts.js              # Attempt submission & feedback
├── controllers/
│   ├── authController.js
│   ├── problemController.js
│   └── attemptController.js
├── services/
│   ├── claudeService.js         # Claude API calls
│   ├── problemService.js        # Problem generation/retrieval
│   └── feedbackService.js       # Feedback generation
├── utils/
│   └── validators.js            # Input validation
├── .env.example
├── server.js                    # Entry point
└── package.json
```

### 3.2 Key Backend Endpoints

**Authentication:**
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Login & get JWT token
- `POST /api/auth/refresh` - Refresh token

**Problems:**
- `GET /api/problems/random` - Get a random problem
- `GET /api/problems?difficulty=algebra&topic=equations` - Filter problems
- `GET /api/problems/:id` - Get specific problem

**Attempts & Feedback:**
- `POST /api/attempts/:problemId/submit` - Submit answer
  - Payload: `{ studentAnswer, attemptNumber, inputMethod: 'text' | 'handwritten' }`
  - Response: `{ isCorrect, feedback, nextStep }`
  
- `POST /api/attempts/:problemId/hint` - Request hint
  - Payload: `{ attemptNumber, hintLevel: 'steps' | 'steps-with-solution' }`
  - Response: `{ hint, explanation }`

**Progress:**
- `GET /api/progress/dashboard` - Get student stats
- `GET /api/progress/history` - Get attempt history

---

## 4. CLAUDE API INTEGRATION STRATEGY

### 4.1 API Usage Points

**1. Problem Evaluation**
- **Endpoint:** POST /api/attempts/:problemId/submit
- **Task:** Verify if student answer is correct
- **Prompt Template:**
```
Problem: [problem statement]
Student's Answer: [student's typed or OCR'd answer]
Expected Answer: [correct answer]

Evaluate if the student's answer is mathematically correct. 
Consider minor notation differences as correct.
Respond with JSON: { isCorrect: boolean, reasoning: string }
```

**2. Feedback Generation**
- **Task:** Provide encouraging, specific feedback
- **Prompt Template:**
```
Problem: [problem]
Student Answer: [answer]
Is Correct: [true/false]
Correct Answer: [answer]

Generate a brief, encouraging response (1-2 sentences) that:
- If correct: Affirms their work and asks them to solve the next problem
- If incorrect: Identifies what went wrong without giving the answer
```

**3. Step-by-Step Hints**
- **Task:** Break down solution into pedagogical steps
- **Prompt Template:**
```
Problem: [problem]
Difficulty Level: [pre-algebra/algebra-1/algebra-2]

Provide 3-4 numbered steps the student should follow to solve this problem.
Do NOT include the final answer in the steps.
Make steps clear and progressively build toward the solution.
Format as JSON: { steps: [step1, step2, step3, ...] }
```

**4. Complete Solution with Explanation**
- **Task:** Provide full working with detailed explanation
- **Prompt Template:**
```
Problem: [problem]

Show the complete solution step-by-step with explanations for each step.
Format as: "Step 1: [action] because [why]. This gives us [result]."
Include the final answer clearly at the end.
```

### 4.2 Rate Limiting & Caching
- Cache problem hints and solutions in MongoDB to reduce API calls
- Implement request queuing to handle multiple simultaneous users
- Store frequently generated explanations
- Monitor Claude API usage monthly

### 4.3 Cost Optimization
- Use Claude Haiku for simple validation tasks (checking answers)
- Use Claude Sonnet for more complex tasks (hint generation, explanations)
- Implement caching to avoid regenerating explanations for identical problems

---

## 5. FRONTEND STRUCTURE

### 5.1 Directory Layout
```
client/
├── src/
│   ├── components/
│   │   ├── ProblemDisplay.jsx      # Shows current problem
│   │   ├── InputMethods.jsx        # Tabs: Type vs Draw
│   │   ├── TextInput.jsx           # Text answer input
│   │   ├── DrawingCanvas.jsx       # Canvas + stylus support
│   │   ├── HintSystem.jsx          # Progressive hint display
│   │   ├── FeedbackPanel.jsx       # Show correct/incorrect + feedback
│   │   ├── ProgressDashboard.jsx   # Stats & streak
│   │   └── Navigation.jsx          # Header & nav
│   ├── pages/
│   │   ├── Home.jsx                # Landing/dashboard
│   │   ├── Practice.jsx            # Main practice page
│   │   ├── Stats.jsx               # Progress & history
│   │   └── Settings.jsx            # User preferences
│   ├── services/
│   │   ├── api.js                  # Axios config & API calls
│   │   └── auth.js                 # Auth token management
│   ├── hooks/
│   │   ├── useProblem.js           # Fetch & manage problem
│   │   ├── useProgress.js          # Track student progress
│   │   └── useCanvas.js            # Canvas drawing logic
│   ├── styles/
│   │   └── globals.css             # Tailwind + custom styles
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### 5.2 Key React Components

**ProblemDisplay Component**
- Shows problem title, problem text, any diagrams
- Displays attempt counter
- Shows previous attempts/feedback

**InputMethods Component**
- Tab toggle between "Type Your Answer" and "Draw Your Work"
- Validates both input types before submission

**DrawingCanvas Component**
- Integrates `react-sketch-canvas` or similar
- Features:
  - Freehand drawing with stylus/mouse support
  - Eraser tool
  - Clear canvas button
  - Undo/redo
  - Optional: Handwriting OCR to convert drawing to text (via Claude Vision or similar)
  - Save drawing as image before submission

**HintSystem Component**
- Initially hidden hint button
- Click once: Show "Steps" without answer
- Click again: Show "Steps with Solution"
- Different UI for each stage

**FeedbackPanel Component**
- Shows result (Correct! / Not quite...)
- Displays feedback message
- Shows "Next Problem" or "Try Again" button

---

## 6. USER WORKFLOW

### Workflow Diagram
```
1. User Logs In / Registers
   ↓
2. Dashboard: Choose difficulty level + topic (optional)
   ↓
3. Load Problem Page
   ├─ Problem displayed at top
   ├─ Input method tabs (Type / Draw)
   └─ "Check Answer" button
   ↓
4a. IF CORRECT on first try:
   ├─ Show "Correct!" message + encouragement
   ├─ Streak +1
   └─ "Next Problem" button
   ↓
4b. IF INCORRECT:
   ├─ Show feedback (e.g., "You need to...")
   ├─ Enable "Show Steps" button
   └─ Allow second attempt
   ↓
5a. IF Second attempt CORRECT:
   ├─ Show "Great job!" + partial credit
   └─ "Next Problem" button
   ↓
5b. IF Still INCORRECT after 2 attempts:
   ├─ Enable "Show Steps & Solution" button
   ├─ Show complete worked solution
   ├─ Option to review or move on
   └─ Mark as "needs review" in progress
   ↓
6. Track Progress
   ├─ Store attempt data
   ├─ Update stats (accuracy, streak, topics)
   └─ Recommend topics to practice
```

---

## 7. PROBLEM BANK DESIGN

### 7.1 Problem Schema (MongoDB)
```javascript
{
  _id: ObjectId,
  title: "Solving Two-Step Equations",
  category: "algebra",
  subcategory: "linear-equations",
  difficulty: "algebra-1",
  problemText: "Solve for x: 3x + 5 = 20",
  answerFormat: "number" | "expression" | "fraction",
  correctAnswer: "5",
  alternateAnswers: ["x = 5", "5"],  // Accept variations
  problemImage: null,  // Optional: URL for diagram
  hints: [
    {
      level: "steps",
      content: "Step 1: Subtract 5 from both sides..."
    },
    {
      level: "solution",
      content: "Step 1: 3x + 5 - 5 = 20 - 5..."
    }
  ],
  explanation: "Full explanation with working",
  createdAt: Date,
  updatedAt: Date
}
```

### 7.2 Problem Generation Strategy
- **Pre-populate** a MongoDB collection with 100-200 hand-created problems
- **Randomly select** from database (initially)
- **Future enhancement:** Use Claude to dynamically generate new problems based on difficulty/topic

---

## 8. DRAWING & STYLUS SUPPORT

### 8.1 Canvas Library Options

**Option 1: `react-sketch-canvas`** (Recommended)
```bash
npm install react-sketch-canvas
```
- Lightweight, touch-friendly
- Stylus support on tablets
- Export as image/SVG
- Undo/redo built-in

**Option 2: HTML5 Canvas (Custom)**
- Full control but more code
- Better performance for complex drawings
- Requires custom stylus handling

### 8.2 Implementation Steps
1. **DrawingCanvas component:**
   - Canvas element with touch/mouse/stylus events
   - Toolbar: color picker, brush size, eraser, clear, undo/redo
   - Export button to convert drawing → image

2. **Canvas → Submission:**
   - User completes drawing and clicks "Submit Work"
   - Canvas saved as PNG or base64 image
   - Sent to backend with metadata

3. **Optional OCR:**
   - Send handwritten image to Claude Vision API
   - Claude extracts text representation
   - Use extracted text for answer verification

---

## 9. IMPLEMENTATION ROADMAP

### Phase 1: Core MVP (Weeks 1-2)
- [ ] Set up MERN boilerplate
- [ ] Create basic authentication (register/login)
- [ ] Build Problem model and populate sample problems
- [ ] Create ProblemDisplay + TextInput components
- [ ] Implement basic answer submission to backend
- [ ] Integrate Claude API for answer validation
- [ ] Build HintSystem component
- [ ] Create simple feedback loop

### Phase 2: Drawing & UX (Week 3)
- [ ] Add DrawingCanvas component
- [ ] Stylus/tablet support
- [ ] Canvas → image export
- [ ] Improve UI/styling with Tailwind
- [ ] Add progress dashboard

### Phase 3: Enhancements (Week 4+)
- [ ] Problem filtering by difficulty/topic
- [ ] Streak system
- [ ] Performance analytics
- [ ] Handwriting OCR (optional)
- [ ] Problem difficulty adjustment based on performance
- [ ] Review previous problems

---

## 10. ENVIRONMENT VARIABLES (.env)

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mathdb
CLAUDE_API_KEY=sk-ant-...
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

---

## 11. KEY IMPLEMENTATION DETAILS

### 11.1 Answer Validation Logic
```javascript
// Backend: attemptController.js
exports.submitAnswer = async (req, res) => {
  const { studentAnswer, inputMethod } = req.body;
  const { problemId } = req.params;
  
  // Fetch problem
  const problem = await Problem.findById(problemId);
  
  // If handwritten, optionally extract via OCR
  let answerText = studentAnswer;
  if (inputMethod === 'handwritten') {
    // Call Claude Vision to extract text from image
    answerText = await claudeService.extractHandwriting(studentAnswer);
  }
  
  // Validate with Claude
  const validation = await claudeService.validateAnswer(
    problem.problemText,
    answerText,
    problem.correctAnswer
  );
  
  // Store attempt
  const attempt = await Attempt.create({
    userId: req.user.id,
    problemId,
    studentAnswer: answerText,
    isCorrect: validation.isCorrect,
    attemptNumber: req.body.attemptNumber,
    timestamp: new Date()
  });
  
  // Generate feedback
  const feedback = await claudeService.generateFeedback(
    problem,
    studentAnswer,
    validation.isCorrect
  );
  
  res.json({
    isCorrect: validation.isCorrect,
    feedback: feedback,
    nextStep: validation.isCorrect ? 'NEXT_PROBLEM' : 'TRY_AGAIN'
  });
};
```

### 11.2 Claude Service Template
```javascript
// services/claudeService.js
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

exports.validateAnswer = async (problemText, studentAnswer, correctAnswer) => {
  const message = await client.messages.create({
    model: "claude-opus-4-1", // Or claude-sonnet-4 for faster
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `
Problem: ${problemText}
Student's Answer: ${studentAnswer}
Correct Answer: ${correctAnswer}

Is the student's answer mathematically equivalent to the correct answer?
Consider minor notation differences.
Respond with ONLY a JSON object: { "isCorrect": true/false, "reasoning": "..." }
        `
      }
    ]
  });
  
  return JSON.parse(message.content[0].text);
};

exports.generateSteps = async (problemText, difficulty) => {
  // Similar pattern...
};

exports.generateFeedback = async (problem, studentAnswer, isCorrect) => {
  // Similar pattern...
};
```

---

## 12. SECURITY CONSIDERATIONS

- **JWT Authentication:** Secure token-based auth
- **CORS:** Configure to allow only frontend domain
- **Rate Limiting:** Prevent abuse of Claude API calls
- **Input Validation:** Sanitize all user inputs
- **HTTPS:** Use in production
- **API Key Protection:** Store Claude key only on backend (never expose in frontend)

---

## 13. TESTING STRATEGY

- **Unit Tests:** Test validation logic, hint generation
- **Integration Tests:** Test API endpoints with sample data
- **User Testing:** Have students try the app and collect feedback
- **Canvas Testing:** Verify drawing works on various devices/browsers

---

## 14. DEPLOYMENT

- **Backend:** Deploy to Heroku, Railway, or Render
- **Frontend:** Deploy to Vercel or Netlify
- **Database:** MongoDB Atlas (cloud)
- **Environment:** Keep `.env` secrets secure in deployment platform settings

---

## 15. FUTURE ENHANCEMENTS

- Adaptive difficulty (adjust problems based on performance)
- Compete with friends (leaderboards)
- AI-generated problems from Claude for infinite practice
- Video explanations (integrate with YouTube or create custom)
- Teacher dashboard to track student progress
- Offline mode with sync when online
- Mobile app (React Native)
- LaTeX rendering for complex equations
- Problem creation tool for teachers

---

**Ready to start building? Pick Phase 1 components and let me know if you'd like code samples for any specific part!**
