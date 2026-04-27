import { useEffect, useMemo, useState } from 'react';
import { LESSONS } from '../data/lessons';

const STORAGE_KEY = 'finpath-lesson-progress';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function buildSevenDayWindow() {
  return Array.from({ length: 7 }, (_value, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    return day.toISOString().slice(0, 10);
  });
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          points: 0,
          completedDates: [],
          answeredByDate: {}
        };
  } catch {
    return {
      points: 0,
      completedDates: [],
      answeredByDate: {}
    };
  }
}

export default function DailyLesson({ lang }) {
  const [lessonIndex, setLessonIndex] = useState(() => {
    const today = new Date();
    return (today.getDate() - 1) % LESSONS.length;
  });
  const [progress, setProgress] = useState(() => loadProgress());
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const lesson = LESSONS[lessonIndex];
  const todayKey = getTodayKey();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    setSelected(null);
    setFeedback(null);
  }, [lessonIndex]);

  const streakWindow = useMemo(() => buildSevenDayWindow(), []);
  const streakCount = streakWindow.filter((day) => progress.completedDates.includes(day)).length;

  function handleAnswer(index) {
    if (feedback) {
      return;
    }

    const isCorrect = index === lesson.answer;
    setSelected(index);
    setFeedback({
      isCorrect,
      text: lesson.explanation
    });

    setProgress((current) => {
      const alreadyAnswered = current.answeredByDate[todayKey];
      if (alreadyAnswered) {
        return current;
      }

      return {
        points: current.points + 10 + (isCorrect ? 5 : 0),
        completedDates: current.completedDates.includes(todayKey)
          ? current.completedDates
          : [...current.completedDates, todayKey].slice(-30),
        answeredByDate: {
          ...current.answeredByDate,
          [todayKey]: {
            lessonId: lesson.id,
            correct: isCorrect
          }
        }
      };
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-brand-primary/10 bg-[var(--bg-muted)] p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-dark">
              {lesson.topic}
            </div>
            <h2 className="mt-2 mb-1 text-lg font-semibold text-[var(--text-main)]">{lesson.title}</h2>
            <p className="m-0 text-[12px] leading-5 text-[var(--text-muted)]">
              {lang === 'hi'
                ? 'हर दिन एक छोटा पाठ, एक छोटा सवाल, और एक मजबूत आदत।'
                : 'One short lesson, one quick quiz, and one stronger money habit each day.'}
            </p>
          </div>
          <div className="rounded-2xl bg-brand-light px-3 py-2 text-right">
            <div className="text-[11px] font-medium text-brand-dark">
              {lang === 'hi' ? 'पॉइंट्स' : 'Points'}
            </div>
            <div className="text-lg font-semibold text-brand-dark">{progress.points}</div>
          </div>
        </div>
      </div>

      <div className="rounded-[30px] border border-brand-primary/10 bg-[var(--bg-panel)] p-4 shadow-sm">
        <div className="space-y-3 text-[13px] leading-6 text-[var(--text-main)]">
          <p className="m-0">{lesson.body}</p>
          <div className="rounded-2xl bg-brand-light/70 px-3 py-3 text-brand-dark">
            <div className="text-[11px] font-semibold uppercase tracking-wide">Example</div>
            <div className="mt-1">{lesson.example}</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold text-[var(--text-main)]">{lesson.question}</div>
          <div className="mt-3 space-y-2">
            {lesson.options.map((option, index) => {
              const isChosen = selected === index;
              const isCorrect = feedback && lesson.answer === index;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(index)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-[13px] transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${
                    isCorrect
                      ? 'border-brand-primary bg-brand-light text-brand-dark'
                      : isChosen
                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                        : 'border-[var(--border-soft)] bg-[var(--bg-muted)] text-[var(--text-main)] hover:border-brand-primary/25'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {feedback ? (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-[13px] leading-6 ${
              feedback.isCorrect
                ? 'border-brand-primary/20 bg-brand-light text-brand-dark'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide">
              {feedback.isCorrect ? 'Correct' : 'Not quite'}
            </div>
            <div className="mt-1">{feedback.text}</div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[28px] border border-brand-primary/10 bg-[var(--bg-panel)] p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-[var(--text-main)]">
              {lang === 'hi' ? '7 दिन की streak' : '7-day streak'}
            </div>
            <div className="mt-1 text-[12px] text-[var(--text-muted)]">
              {streakCount}/7 {lang === 'hi' ? 'दिन' : 'days'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLessonIndex((current) => (current + 1) % LESSONS.length)}
            className="rounded-full border border-brand-primary/20 bg-white px-3 py-2 text-[11px] font-medium text-brand-dark shadow-sm transition hover:border-brand-primary/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          >
            {lang === 'hi' ? 'अगला पाठ' : 'Next lesson'}
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {streakWindow.map((day) => {
            const filled = progress.completedDates.includes(day);
            return (
              <span
                key={day}
                className={`h-3.5 w-3.5 rounded-full border ${
                  filled ? 'border-brand-primary bg-brand-primary' : 'border-brand-primary/35 bg-transparent'
                }`}
                aria-label={filled ? 'Completed day' : 'Not completed'}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
