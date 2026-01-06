# Math Practice App - Complete Setup Guide for New Coders

## Overview
This document walks you through everything you need to install and set up to build a math practice web app using MERN stack (MongoDB, Express, React, Node.js) with Claude AI integration.

---

## PART 1: WHAT YOU NEED TO KNOW

### What is MERN?
- **M**ongoDB - Database (stores user data, problems, attempts)
- **E**xpress - Backend web framework (handles API requests)
- **R**eact - Frontend JavaScript library (what users see)
- **N**ode.js - JavaScript runtime (runs code on server)

### How This App Works
1. User opens the app in their browser
2. They see a math problem
3. They solve it by typing OR drawing on a canvas
4. The backend sends their answer to Claude AI to check if it's correct
5. Claude AI generates helpful feedback and hints
6. The app shows the student what to do next

---

## PART 2: PREREQUISITES - What You Need on Your Computer

Before you start, you need:
- A code editor (we recommend **Visual Studio Code** - it's free)
- A terminal/command prompt to run commands
- Git for version control (optional but helpful)

### Check If You Already Have These

Open your terminal/command prompt and type these commands:

```bash
# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version
```

If you see version numbers, you're good. If not, install Node.js (which includes npm).

---

## PART 3: INSTALLATION STEPS

### Step 1: Install Node.js and npm

**What is Node.js?** It's JavaScript that runs on your computer/server (not just in browsers).
**What is npm?** It's a package manager that downloads code libraries you need.

**Windows/Mac/Linux:**
1. Go to https://nodejs.org
2. Click the "LTS" (Long Term Support) version - it's the most stable
3. Download and install it
4. Restart your terminal
5. Verify: `node --version` and `npm --version`

---

### Step 2: Install MongoDB

MongoDB is the database that stores all your data (users, problems, student attempts).

**Option A: MongoDB Atlas (Cloud - Recommended for beginners)**
- This is easier and you don't have to manage your own server
- Go to https://www.mongodb.com/cloud/atlas
- Create a free account
- Create a free cluster (database)
- Get your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)
- Save this - you'll need it later

**Option B: Local MongoDB (On Your Computer)**
- Go to https://www.mongodb.com/try/download/community
- Download the Community version
- Install it following the installer
- Run MongoDB locally on your computer
- Connection string: `mongodb://localhost:27017/mathdb`

**For this guide, we recommend Option A (Atlas) because it's simpler.**

---

### Step 3: Install Claude API Key

You need an API key to use Claude.

1. Go to https://console.anthropic.com
2. Sign up or log in to your Anthropic account
3. Go to "API Keys"
4. Create a new API key
5. Copy it and save it somewhere safe (you'll only see it once)
6. **Never share this key publicly**

---

### Step 4: Install a Code Editor

Download **Visual Studio Code** from https://code.visualstudio.com

Install it and open it. This is where you'll write your code.

---

### Step 5: Create a Project Directory

In your terminal, create a folder for your project:

```bash
# Create a folder called MathApp
mkdir MathApp
cd MathApp

# Create a folder for the backend (server)
mkdir server

# Create a folder for the frontend (what users see)
mkdir client

cd server
```

---

## PART 4: BACKEND SETUP (The Server)

This is the part that runs on your computer/server and handles the logic.

### 4.1: Initialize Node Project

In the `server` folder, create a package.json file:

```bash
npm init -y
```

This creates a file that lists all the code libraries your server needs.

### 4.2: Install Backend Dependencies

Run these commands in the `server` folder:

```bash
# Core dependencies
npm install express dotenv cors mongoose bcryptjs jsonwebtoken

# Claude AI API
npm install @anthropic-ai/sdk

# Development tools
npm install --save-dev nodemon

# Database
# MongoDB driver is included with mongoose
```

**What each one does:**
- `express` - Web server framework
- `dotenv` - Reads your secret keys from .env file
- `cors` - Allows frontend to talk to backend
- `mongoose` - Makes it easier to work with MongoDB
- `bcryptjs` - Encrypts passwords
- `jsonwebtoken` - Creates secure login tokens
- `@anthropic-ai/sdk` - Talks to Claude AI
- `nodemon` - Automatically restarts server when you make changes

### 4.3: Create .env File

In the `server` folder, create a file called `.env`:

```
# Database
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/mathdb

# Claude API
CLAUDE_API_KEY=sk-ant-XXXXXXXXXXXX

# Server
PORT=5000
NODE_ENV=development

# JWT Secret (make this something random and long)
JWT_SECRET=your_super_secret_key_12345_change_this
```

Replace:
- `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB Atlas credentials
- `sk-ant-XXXXXXXXXXXX` with your actual Claude API key

**IMPORTANT:** Add `.env` to your `.gitignore` file so you never accidentally upload your secret keys to the internet!

### 4.4: Create Basic Server File

Create a file called `server.js` in the `server` folder with basic setup.
(See the Implementation Plan document for code)

### 4.5: Update package.json Scripts

Edit the `package.json` file to add these scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 4.6: Test Your Server

Run your server:

```bash
npm run dev
```

You should see: `Server running on port 5000`

---

## PART 5: FRONTEND SETUP (What Users See)

This is the part users interact with in their browser.

### 5.1: Create React App

In the `client` folder:

```bash
npm create vite@latest . -- --template react
```

This sets up a modern React project with everything you need.

### 5.2: Install Frontend Dependencies

In the `client` folder:

```bash
npm install

# Additional dependencies
npm install axios react-router-dom

# For drawing/canvas
npm install react-sketch-canvas

# Styling
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

**What each does:**
- `axios` - Makes HTTP requests to your backend
- `react-router-dom` - Navigation between pages
- `react-sketch-canvas` - Drawing canvas for stylus support
- `tailwindcss` - Beautiful CSS styling

### 5.3: Configure Environment

Create a file called `.env` in the `client` folder:

```
VITE_API_URL=http://localhost:5000/api
```

This tells React where to find your backend.

### 5.4: Test Your Frontend

In the `client` folder:

```bash
npm run dev
```

You should see: `➜  Local: http://localhost:5173/`

Open that URL in your browser. You should see a React starter page.

---

## PART 6: RUNNING BOTH SERVER AND CLIENT

You need two terminal windows open:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Output: Server running on port 5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Output: ➜  Local: http://localhost:5173/
```

Now your frontend and backend can talk to each other!

---

## PART 7: PROJECT STRUCTURE YOU'VE CREATED

```
MathApp/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Problem.js
│   │   └── Attempt.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── problems.js
│   │   └── attempts.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── problemController.js
│   │   └── attemptController.js
│   ├── services/
│   │   └── claudeService.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env (SECRET - don't share!)
│   ├── server.js
│   ├── package.json
│   └── node_modules/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProblemDisplay.jsx
│   │   │   ├── TextInput.jsx
│   │   │   ├── DrawingCanvas.jsx
│   │   │   ├── HintSystem.jsx
│   │   │   ├── FeedbackPanel.jsx
│   │   │   └── Navigation.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Practice.jsx
│   │   │   └── Stats.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── node_modules/
```

---

## PART 8: STEP-BY-STEP IMPLEMENTATION PLAN

Follow these phases in order:

### Phase 1: Basic Setup (Week 1)
- ✅ Install all dependencies (you're doing this now!)
- ✅ Create basic server.js and React app
- Build User authentication (login/register)
- Create Problem database model
- Create simple problem display page
- Hook up text input for answers

### Phase 2: Claude Integration (Week 2)
- Connect to Claude API
- Validate student answers with Claude
- Generate feedback from Claude
- Build hint system (steps only → steps + solution)
- Create FeedbackPanel component

### Phase 3: Drawing Support (Week 3)
- Add DrawingCanvas component
- Make canvas work with stylus/tablet
- Let users submit drawn work
- Optional: OCR to convert drawing to text

### Phase 4: Polish & Features (Week 4+)
- Progress dashboard
- Streak tracking
- Problem filtering
- Styling and design
- Deploy to production

---

## PART 9: COMMON COMMANDS YOU'LL USE

```bash
# Check Node.js and npm versions
node --version
npm --version

# Start backend server
cd server
npm run dev

# Start frontend dev server
cd client
npm run dev

# Install a new package
npm install package-name

# Save a development-only package
npm install --save-dev package-name

# Run a specific script from package.json
npm run script-name

# Stop a running server
# Press Ctrl + C in the terminal
```

---

## PART 10: TROUBLESHOOTING

### Port Already in Use
If port 5000 or 5173 is already in use:
- Change PORT in server/.env to 5001
- Or kill the process using that port

### MongoDB Connection Error
- Check your MONGODB_URI in .env is correct
- Make sure your IP is whitelisted in MongoDB Atlas (go to Network Access)
- Check your password doesn't have special characters

### Claude API Error
- Make sure your CLAUDE_API_KEY is correct
- Check that your API key hasn't been revoked
- Visit https://console.anthropic.com to verify

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Frontend Can't Find Backend
- Make sure backend is running on port 5000
- Check VITE_API_URL in client/.env is correct
- Check CORS is properly configured in server.js

---

## PART 11: NEXT STEPS

Once you have everything installed and running:

1. Read the **Implementation Plan** document
2. Use **Claude Code** to generate the actual code files
3. Start with Phase 1 (authentication and basic problem display)
4. Test each piece as you build it
5. Ask Claude for help if something doesn't work

---

## PART 12: USEFUL RESOURCES

- **Node.js Docs:** https://nodejs.org/docs/
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **MongoDB Docs:** https://docs.mongodb.com/
- **Claude API Docs:** https://docs.anthropic.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Router:** https://reactrouter.com/

---

## PART 13: KEYBOARD SHORTCUTS YOU'LL NEED

- `Ctrl + C` - Stop a running process in terminal
- `Ctrl + \` or `Cmd + \` - Split terminal (VS Code)
- `Ctrl + Shift + ~` - Open terminal in VS Code
- `Ctrl + S` or `Cmd + S` - Save file
- `Ctrl + /` or `Cmd + /` - Comment out code

---

**Congratulations! You're ready to start building. Move to the Implementation Plan document next.**
