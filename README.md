# FinPath

FinPath is an AI-powered financial literacy coach for first-time earners, gig workers, factory workers, domestic workers, and rural workers in India. The app is built around **Riya**, a warm and non-judgmental money coach who explains savings, loans, insurance, and government schemes in simple English or Hindi.

The goal is simple: help users earning around Rs 10,000 to Rs 30,000 per month understand one better money decision at a time.

## Why FinPath

Many first-time earners have income but no trusted financial guidance. FinPath gives them a friendly place to ask questions, calculate EMI and savings, learn small daily lessons, and discover useful Indian government schemes without complex jargon.

FinPath is not a stock advisor or a replacement for regulated financial advice. It is a first layer of financial education for people who may never have had one.

## Core Features

- **Chat with Riya:** AI coach with English and Hindi support, quick replies, and conversational memory.
- **Financial Health Check:** Calculates savings, savings rate, expense split, and gives simple AI guidance.
- **Loan Simulator:** Calculates EMI, total repayment, interest paid, and EMI-to-income risk.
- **Daily Micro-Lessons:** Short financial lessons with quizzes, streaks, and points.
- **Government Schemes Finder:** Explains schemes like Jan Dhan, APY, PMJJBY, PMSBY, Mudra, PM Awas, and Sukanya Samriddhi.
- **Hackathon Demo Flow:** Includes Priya demo helpers for quick presentation walkthroughs.
- **Responsive UI:** Mobile-friendly for users and desktop-friendly for hackathon judging, demos, and admin-style viewing.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **AI:** Google Gemini API, default model `gemini-2.5-flash`
- **Storage:** Browser `localStorage` for lessons, streaks, points, and lightweight chat state
- **Deployment:** Single Node service serving the built frontend and same-origin API routes

## Project Structure

```text
finpath/
|-- backend/
|   |-- routes/
|   |   `-- chat.js
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- data/
|   |   |-- hooks/
|   |   |-- utils/
|   |   `-- App.jsx
|   `-- index.html
|-- package.json
|-- render.yaml
`-- README.md
```

## Setup

Create `backend/.env` from `backend/.env.example` and add your Gemini API key:

```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

Install dependencies:

```bash
npm install
```

Run the full local development app:

```bash
npm run dev
```

Build and run the production-style app locally:

```bash
npm run build
npm start
```

## Demo Scenario

Use Priya as the main story during a hackathon presentation:

> Priya is 24, works at a garment factory in Indore, earns Rs 18,000 per month, and does not understand EMI or formal savings.

Suggested demo flow:

1. Open chat, switch to Hindi, and ask Riya what EMI means.
2. Use Health Check with Priya's income and expenses to show savings rate.
3. Use Loan Simulator for a Rs 50,000 education loan at 14% for 18 months.
4. Complete one Daily Lesson quiz to show points and streaks.
5. Open Government Schemes and ask Riya about PM Jeevan Jyoti Bima.

## AI Safety

Riya is designed to:

- explain financial terms in simple language
- avoid specific stock, crypto, or forex recommendations
- avoid asking for Aadhaar, PAN, or sensitive identity details
- keep replies short, warm, and action-oriented
- give educational guidance instead of regulated investment advice

## Deployment

FinPath can run as a single Node web service. The Express backend serves the built React frontend from `frontend/dist`, and the frontend calls `/api/chat` on the same origin.

For deployment, set these environment variables in the hosting dashboard:

```env
GEMINI_API_KEY=your-production-gemini-key
GEMINI_MODEL=gemini-2.5-flash
```

Recommended deployment target: Render, because the project already includes `render.yaml` for a full-stack Node deployment.

## Pitch Line

FinPath is not replacing a financial advisor. It is becoming the first financial guide Priya ever had.
