import { useEffect, useRef, useState } from 'react';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 self-start">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
        R
      </div>
      <div className="rounded-2xl rounded-bl-md border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="h-2 w-2 rounded-full bg-brand-primary/80 animate-pulse-dot"
              style={{ animationDelay: `${dot * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] rounded-2xl rounded-br-md bg-brand-primary px-4 py-3 text-[13px] leading-6 text-white shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
        R
      </div>
      <div className="max-w-[84%] rounded-2xl rounded-bl-md border border-brand-primary/10 bg-brand-light px-4 py-3 text-[13px] leading-6 text-brand-dark shadow-sm">
        {message.content}
      </div>
    </div>
  );
}

export default function Chat({
  lang,
  messages,
  isTyping,
  quickReplies,
  onSendMessage,
  pendingMessage
}) {
  const [input, setInput] = useState('');
  const listRef = useRef(null);
  const pendingRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (pendingMessage?.id && pendingMessage.id !== pendingRef.current) {
      pendingRef.current = pendingMessage.id;
      onSendMessage(pendingMessage.text);
    }
  }, [onSendMessage, pendingMessage]);

  function submitMessage(event) {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }
    onSendMessage(input);
    setInput('');
  }

  return (
    <div className="flex h-full flex-col">
      <div className="rounded-[28px] border border-brand-primary/10 bg-[var(--bg-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-main)] shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Meet Priya
        </div>
        <p className="mt-2 mb-0 text-[13px] text-[var(--text-muted)]">
          This demo follows Priya, a 24-year-old garment factory worker in Indore earning Rs
          18,000 a month, as she learns saving, EMI, and insurance basics.
        </p>
      </div>

      <div
        ref={listRef}
        className="scrollbar-hidden mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping ? <TypingIndicator /> : null}
      </div>

      <div className="mt-4 space-y-3 border-t border-[var(--border-soft)] pt-4">
        <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => onSendMessage(reply)}
              className="shrink-0 rounded-full border border-brand-primary/15 bg-brand-light px-3 py-2 text-[11px] font-medium text-brand-dark transition hover:border-brand-primary/30 hover:bg-brand-primary/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            >
              {reply}
            </button>
          ))}
        </div>

        <form onSubmit={submitMessage} className="flex items-end gap-3">
          <label className="sr-only" htmlFor="chat-input">
            {lang === 'hi' ? 'रिया को संदेश लिखें' : 'Type a message for Riya'}
          </label>
          <textarea
            id="chat-input"
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={lang === 'hi' ? 'अपना सवाल लिखिए...' : 'Ask Riya anything...'}
            className="max-h-28 min-h-[48px] flex-1 resize-none rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-3 text-[13px] leading-6 text-[var(--text-main)] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
          <button
            type="submit"
            className="rounded-2xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          >
            {lang === 'hi' ? 'भेजें' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
