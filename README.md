# FinPath

FinPath is a mobile-first web app for first-time earners and rural workers in India. It combines a warm AI coach named Riya with simple financial tools for saving, loans, daily lessons, and government scheme discovery.

## Stack

- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express
- AI: Google Gemini API (`gemini-2.5-flash` by default)
- Storage: in-memory chat + `localStorage` for lesson streaks and points

## Features

- Chat with Riya in English or Hindi with last-10-message context
- Financial Health Check with savings amount, savings rate, breakdown bar, and AI guidance
- Loan Simulator with EMI, total repayment, total interest, and income ratio warning state
- Daily micro-lessons with 8 hardcoded lessons, quiz feedback, streak dots, and points
- Government schemes finder with one-tap handoff into the chat tab
- Priya demo flow helpers on the Health and Loan tabs

## Setup

1. Create `backend/.env` from `backend/.env.example`
2. Add your Gemini API key:

```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

3. Install and run:

```bash
npm install
npm run dev

For a production-style local run:

```bash
npm run build
npm start
```
```

## Local URLs

- Frontend: `http://127.0.0.1:5173`
- Backend health check: `http://127.0.0.1:3001/api/health`
- Production-style app after `npm start`: `http://127.0.0.1:3001`

## Demo story

Use this hackathon story:

> This is Priya. She is 24, works at a garment factory in Indore, earns Rs 18,000/month.
> She has never had a savings account and does not understand what an EMI is.

Suggested flow:

1. Switch to Hindi and ask `EMI kya hoti hai?`
2. Health Check: income `18000`, rent `6000`, food `4000`, transport `2000`, other `3000`
3. Loan Simulator: amount `50000`, rate `14`, months `18`, income `18000`
4. Open the Daily Lesson tab and answer the first quiz
5. Open Schemes and tap PM Jeevan Jyoti Bima

## Deployment notes

- The backend serves `frontend/dist`, so FinPath can be deployed as a single Node web service.
- In production, the app uses same-origin `/api/chat`, which avoids CORS and proxy issues.
- If the Gemini key is missing, the UI still works and the backend returns a helpful fallback message.
- The app is designed for a max width of 420px and feels best in a phone-sized viewport.
