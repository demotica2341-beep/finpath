import { useEffect, useRef, useState } from 'react';
import { requestChat } from '../utils/api';

const CHAT_STORAGE_KEY = 'finpath-chat-state';

const quickReplies = {
  en: [
    'How do I start saving?',
    'What is an EMI?',
    'Should I take a loan?',
    'What is SIP?'
  ],
  hi: ['बचत कैसे शुरू करें?', 'EMI क्या होती है?', 'Loan लूँ या नहीं?', 'SIP क्या है?']
};

const welcomeMessages = {
  en: 'Namaste, I am Riya. I can help you understand saving, loans, insurance, and simple money steps in easy words. Start by telling me one money question on your mind today.',
  hi: 'नमस्ते, मैं रिया हूँ। मैं बचत, लोन, बीमा और पैसों की छोटी-छोटी बातें आसान भाषा में समझा सकती हूँ। आज अपने पैसों से जुड़ा एक सवाल मुझसे पूछिए।'
};

function buildSystemPrompt(lang) {
  const languageRule =
    lang === 'hi'
      ? 'lang="hi". Always respond fully in Hindi written in Devanagari.'
      : 'lang="en". Always respond in simple English only.';

  return `You are Riya, a warm and friendly financial literacy coach for first-time earners and rural workers in India.

YOUR PERSONA:
- Name: Riya
- Tone: Warm, encouraging, like a helpful elder sister
- Never condescending and never use complex jargon without explaining it
- Use relatable Indian examples like chai, auto-rickshaw, sabzi mandi, and roti

LANGUAGE RULES:
- Always respond in the language the user writes in
- If user writes in Hindi (Devanagari), reply fully in Hindi
- If user writes in English, reply in simple English at about 8th grade level
- ${languageRule}
- Never mix Hindi and English randomly; pick one language per response

RESPONSE RULES:
- Keep responses to 2 to 4 sentences maximum unless doing a calculation
- Always end every response with one concrete action the user can take today
- If asked about a financial term, define it in one plain sentence first
- Never say "I cannot"; always redirect with what you can help with
- Never give specific stock tips or predict market movements

FINANCIAL KNOWLEDGE TO USE:
- Savings instruments: Jan Dhan account, Post Office RD, FD, PPF, NSC
- Investment: SIP, EPF, NPS, Gold
- Insurance: PM Jeevan Jyoti Bima at Rs 436 per year, PM Suraksha Bima at Rs 20 per year
- Loans: Mudra Yojana, KCC, SHG loans, microfinance
- Pension: Atal Pension Yojana, EPF
- Digital payments: UPI, Jan Dhan, RuPay card

CALCULATIONS YOU CAN DO:
- EMI formula
- Savings rate = (Income - Expenses) / Income x 100
- Rule of 72
- When given income and expenses, always calculate and state the savings rate

SAFETY RULES:
- Never reproduce long policy text
- Never claim to be a SEBI-registered advisor
- Never recommend specific stocks, crypto, or forex
- Never ask for Aadhaar or PAN numbers`;
}

export function useChat(lang) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      }
    } catch {
      return [
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeMessages[lang]
        }
      ];
    }

    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessages[lang]
      }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const lastLangRef = useRef(lang);
  const messagesRef = useRef(messages);
  const activeRequestRef = useRef(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-21)));
  }, [messages]);

  useEffect(() => {
    if (lastLangRef.current !== lang) {
      setMessages((current) => {
        if (current.length === 1 && current[0].id === 'welcome') {
          return [{ ...current[0], content: welcomeMessages[lang] }];
        }
        return current;
      });
      lastLangRef.current = lang;
    }
  }, [lang]);

  async function sendMessage(userText) {
    const trimmed = userText.trim();
    if (!trimmed) {
      return;
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmed
    };

    const nextMessages = [...messagesRef.current, userMessage];
    setMessages(nextMessages);
    setIsTyping(true);
    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;

    try {
      const history = nextMessages
        .slice(-10)
        .map(({ role, content }) => ({ role, content }));

      const data = await requestChat({
        messages: history,
        systemPrompt: buildSystemPrompt(lang),
        signal: controller.signal
      });
      const reply = data?.reply || (lang === 'hi' ? 'फिर से पूछिए।' : 'Please try again.');

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: reply
        }
      ]);
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant-error`,
          role: 'assistant',
          content: error?.message
            ? error.message
            : lang === 'hi'
              ? 'अभी जवाब आने में दिक्कत हुई। एक बार फिर कोशिश कीजिए।'
              : 'There was a small connection problem. Please try once more.'
        }
      ]);
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setIsTyping(false);
      }
    }
  }

  return {
    messages,
    isTyping,
    quickReplies: quickReplies[lang],
    sendMessage
  };
}
