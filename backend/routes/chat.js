import express from 'express';

const router = express.Router();
const MAX_HISTORY_MESSAGES = 10;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (item) =>
        item &&
        (item.role === 'user' || item.role === 'assistant') &&
        typeof item.content === 'string' &&
        item.content.trim()
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, 2000)
    }));
}

router.post('/', async (req, res) => {
  const { messages = [], systemPrompt = '' } = req.body ?? {};
  const apiKey = process.env.GEMINI_API_KEY;
  const sanitizedMessages = normalizeMessages(messages);
  const safeSystemPrompt =
    typeof systemPrompt === 'string' ? systemPrompt.trim().slice(0, 8000) : '';

  if (!sanitizedMessages.length) {
    return res.status(400).json({
      reply: 'Please send at least one message so Riya can help.'
    });
  }

  if (!apiKey) {
    return res.status(503).json({
      reply:
        'Gemini API key is missing. Add GEMINI_API_KEY to backend/.env to chat with Riya.'
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': apiKey
      },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: safeSystemPrompt }]
        },
        contents: sanitizedMessages.map((item) => ({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content }]
        })),
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
          topP: 0.9,
          responseMimeType: 'text/plain',
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      })
      }
    );
    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message ||
        'Riya had trouble reaching Gemini. Please try again.';
      return res.status(response.status).json({ reply: message });
    }

    const replyParts = data?.candidates?.[0]?.content?.parts || [];
    const reply = replyParts
      .map((part) => part?.text || '')
      .join('')
      .trim() ||
      'Riya is ready, but the reply came back empty. Please try once more.';

    return res.json({ reply });
  } catch (error) {
    const isAbort = error?.name === 'AbortError';
    return res.status(500).json({
      reply: isAbort
        ? 'Riya is taking longer than usual to respond. Please try again in a moment.'
        : 'The app could not reach the AI service right now. Check your internet connection and try again.'
    });
  }
});

export default router;
