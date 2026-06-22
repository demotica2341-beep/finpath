import { useEffect, useMemo, useState } from 'react';
import Chat from './components/Chat';
import DailyLesson from './components/DailyLesson';
import HealthCheck from './components/HealthCheck';
import LoanSim from './components/LoanSim';
import Schemes from './components/Schemes';
import { useChat } from './hooks/useChat';

const LANGUAGE_STORAGE_KEY = 'finpath-language';

const tabs = [
  {
    id: 'chat',
    label: 'Chat',
    shortHi: 'चैट',
    description: 'Ask Riya simple money questions',
    stat: 'AI coach'
  },
  {
    id: 'health',
    label: 'Health',
    shortHi: 'हेल्थ',
    description: 'Check income, expense, and savings rate',
    stat: '16.7%'
  },
  {
    id: 'loan',
    label: 'Loan Sim',
    shortHi: 'लोन',
    description: 'Compare EMI pressure before borrowing',
    stat: '<30%'
  },
  {
    id: 'lesson',
    label: 'Lesson',
    shortHi: 'पाठ',
    description: 'Daily financial habit and quiz',
    stat: '+15 pts'
  },
  {
    id: 'schemes',
    label: 'Schemes',
    shortHi: 'योजनाएँ',
    description: 'Find useful government schemes',
    stat: '7 schemes'
  }
];

function BrandHeader({ lang, setLang }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary text-lg font-bold text-white shadow-sm">
          R
        </div>
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-[var(--text-main)]">
            Riya, your FinPath coach
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <span className="inline-flex h-2 w-2 rounded-full bg-brand-primary" />
            <span>{lang === 'hi' ? 'ऑनलाइन' : 'Online now'}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 rounded-full border border-brand-primary/15 bg-brand-light p-1">
        {[
          ['en', 'EN'],
          ['hi', 'हि']
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setLang(value)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${
              lang === value ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-dark hover:bg-white/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}

function Sidebar({ activeTab, lang, onTabChange }) {
  return (
    <aside className="hidden border-r border-[var(--border-soft)] bg-[var(--bg-panel)] lg:flex lg:w-[280px] lg:flex-col">
      <div className="px-6 py-6">
        <div className="text-[11px] font-semibold uppercase text-brand-dark">FinPath</div>
        <h1 className="mt-3 text-2xl font-bold leading-tight text-[var(--text-main)]">
          Money decisions, made simple.
        </h1>
        <p className="mt-3 text-[13px] leading-6 text-[var(--text-muted)]">
          A practical workspace for first-time earners to chat, calculate, learn, and discover support.
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-3 pb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`group rounded-lg border px-3 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${
                isActive
                  ? 'border-brand-primary/25 bg-brand-light text-brand-dark'
                  : 'border-transparent text-[var(--text-muted)] hover:border-[var(--border-soft)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{lang === 'hi' ? tab.shortHi : tab.label}</span>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                    isActive ? 'bg-white/80 text-brand-dark' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                  }`}
                >
                  {tab.stat}
                </span>
              </div>
              <div className="mt-1 text-[11px] leading-5">{tab.description}</div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function DesktopContext({ activeTab, lang, onJump }) {
  const active = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const checklist = useMemo(
    () => [
      ['chat', 'Ask what EMI means'],
      ['health', 'Enter Priya demo numbers'],
      ['loan', 'Check Rs 50,000 loan'],
      ['lesson', 'Complete emergency fund quiz'],
      ['schemes', 'Open PMJJBY details']
    ],
    []
  );

  return (
    <aside className="hidden border-l border-[var(--border-soft)] bg-[var(--bg-panel)] xl:flex xl:w-[320px] xl:flex-col xl:gap-4 xl:overflow-y-auto xl:p-5">
      <section className="rounded-lg border border-brand-primary/10 bg-brand-light/70 p-4">
        <div className="text-[11px] font-semibold uppercase text-brand-dark">Current workspace</div>
        <h2 className="mt-2 text-lg font-semibold text-[var(--text-main)]">{active.label}</h2>
        <p className="mt-2 text-[13px] leading-6 text-[var(--text-muted)]">{active.description}</p>
      </section>

      <section className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-muted)] p-4">
        <div className="text-[11px] font-semibold uppercase text-brand-dark">Demo story</div>
        <p className="mt-2 text-[13px] leading-6 text-[var(--text-main)]">
          Priya is 24, works at a garment factory in Indore, and earns Rs 18,000 per month.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[var(--bg-panel)] p-3">
            <div className="text-[11px] text-[var(--text-muted)]">Income</div>
            <div className="mt-1 text-base font-semibold text-[var(--text-main)]">Rs 18k</div>
          </div>
          <div className="rounded-lg bg-[var(--bg-panel)] p-3">
            <div className="text-[11px] text-[var(--text-muted)]">Target</div>
            <div className="mt-1 text-base font-semibold text-[var(--text-main)]">Rs 1k RD</div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-panel)] p-4">
        <div className="text-[11px] font-semibold uppercase text-brand-dark">2-minute pitch flow</div>
        <div className="mt-3 space-y-2">
          {checklist.map(([id, label], index) => (
            <button
              key={id}
              type="button"
              onClick={() => onJump(id)}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-[12px] transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${
                activeTab === id
                  ? 'border-brand-primary/25 bg-brand-light text-brand-dark'
                  : 'border-[var(--border-soft)] bg-[var(--bg-muted)] text-[var(--text-muted)] hover:border-brand-primary/25'
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-panel)] text-[11px] font-semibold">
                {index + 1}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-brand-primary/10 bg-brand-primary p-4 text-white">
        <div className="text-[11px] font-semibold uppercase text-white/75">Pitch line</div>
        <p className="mt-2 text-sm font-semibold leading-6">
          We are not replacing a financial advisor. We are being the first one Priya ever had.
        </p>
      </section>
    </aside>
  );
}

function MobileNav({ activeTab, lang, onTabChange }) {
  return (
    <nav className="grid grid-cols-5 gap-1 border-t border-[var(--border-soft)] bg-[var(--bg-panel)] px-2 py-2 lg:hidden">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`rounded-lg px-2 py-2 text-center text-[11px] font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${
              isActive ? 'bg-brand-light text-brand-dark' : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            {lang === 'hi' ? tab.shortHi : tab.label}
          </button>
        );
      })}
    </nav>
  );
}

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
    <div className="min-h-screen px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1480px] overflow-hidden rounded-xl border border-white/70 bg-[var(--bg-panel)] shadow-app backdrop-blur sm:min-h-[calc(100vh-2.5rem)] lg:rounded-lg">
        <Sidebar activeTab={activeTab} lang={lang} onTabChange={setActiveTab} />

        <div className="flex min-w-0 flex-1 flex-col">
          <BrandHeader lang={lang} setLang={setLang} />

          <main className="min-h-0 flex-1 overflow-y-auto bg-[var(--bg-main-soft)] px-4 py-4 sm:px-5 lg:px-6">
            <div className="mx-auto h-full w-full max-w-[900px]">
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
            </div>
          </main>

          <MobileNav activeTab={activeTab} lang={lang} onTabChange={setActiveTab} />
        </div>

        <DesktopContext activeTab={activeTab} lang={lang} onJump={setActiveTab} />
      </div>
    </div>
  );
}
