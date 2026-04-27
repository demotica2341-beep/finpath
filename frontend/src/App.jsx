import { useEffect, useState } from 'react';
import Chat from './components/Chat';
import DailyLesson from './components/DailyLesson';
import HealthCheck from './components/HealthCheck';
import LoanSim from './components/LoanSim';
import Schemes from './components/Schemes';
import { useChat } from './hooks/useChat';

const LANGUAGE_STORAGE_KEY = 'finpath-language';

const tabs = [
  { id: 'chat', label: 'Chat', shortHi: 'चैट' },
  { id: 'health', label: 'Health', shortHi: 'हेल्थ' },
  { id: 'loan', label: 'Loan Sim', shortHi: 'लोन' },
  { id: 'lesson', label: 'Lesson', shortHi: 'पाठ' },
  { id: 'schemes', label: 'Schemes', shortHi: 'योजनाएँ' }
];

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en');
  const [activeTab, setActiveTab] = useState('chat');
  const [pendingMessage, setPendingMessage] = useState(null);
  const { messages, isTyping, quickReplies, sendMessage } = useChat(lang);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [lang]);

  function handleSendMessage(text) {
    setPendingMessage(null);
    sendMessage(text);
  }

  function handleLearnMore(schemeName) {
    const query =
      lang === 'hi'
        ? `${schemeName} को आसान भाषा में समझाइए। मैं इसके लिए कैसे apply करूँ?`
        : `Tell me more about ${schemeName} in simple terms. How do I apply?`;

    setActiveTab('chat');
    setPendingMessage({
      id: `${Date.now()}-${schemeName}`,
      text: query
    });
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[420px] flex-col overflow-hidden rounded-[36px] border border-white/60 bg-[var(--bg-panel)] shadow-app backdrop-blur">
        <header className="border-b border-[var(--border-soft)] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-lg font-bold text-white">
                R
              </div>
              <div>
                <div className="text-base font-semibold text-[var(--text-main)]">Riya</div>
                <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                  <span className="inline-flex h-2 w-2 rounded-full bg-brand-primary" />
                  <span>{lang === 'hi' ? 'ऑनलाइन' : 'Online now'}</span>
                </div>
              </div>
            </div>

            <div className="flex rounded-full border border-brand-primary/15 bg-brand-light p-1">
              {[
                ['en', 'EN'],
                ['hi', 'हि']
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLang(value)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${
                    lang === value
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'text-brand-dark hover:bg-white/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[26px] bg-brand-light/80 px-4 py-3 text-[12px] leading-5 text-brand-dark">
            <span className="font-semibold">
              500 million Indians have no financial safety net.
            </span>{' '}
            {lang === 'hi'
              ? 'रिया उनसे उनकी भाषा में बात करती है।'
              : 'Riya speaks to them in their language.'}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {activeTab === 'chat' ? (
            <Chat
              lang={lang}
              messages={messages}
              isTyping={isTyping}
              quickReplies={quickReplies}
              onSendMessage={handleSendMessage}
              pendingMessage={pendingMessage}
            />
          ) : null}
          {activeTab === 'health' ? <HealthCheck lang={lang} /> : null}
          {activeTab === 'loan' ? <LoanSim lang={lang} /> : null}
          {activeTab === 'lesson' ? <DailyLesson lang={lang} /> : null}
          {activeTab === 'schemes' ? <Schemes lang={lang} onLearnMore={handleLearnMore} /> : null}
        </main>

        <nav className="grid grid-cols-5 gap-1 border-t border-[var(--border-soft)] bg-[var(--bg-panel)] px-2 py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl px-2 py-2 text-center text-[11px] font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${
                  isActive
                    ? 'bg-brand-light text-brand-dark'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                {lang === 'hi' ? tab.shortHi : tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
