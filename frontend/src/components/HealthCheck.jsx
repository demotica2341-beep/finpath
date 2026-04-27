import { useState } from 'react';
import { requestChat } from '../utils/api';
import { calculateSavings, formatCompactNumber, formatCurrency } from '../utils/finance';

const initialValues = {
  income: '',
  rent: '',
  food: '',
  transport: '',
  other: ''
};

export default function HealthCheck({ lang }) {
  const [form, setForm] = useState(initialValues);
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const income = Number(form.income) || 0;
    const expenses = {
      rent: Number(form.rent) || 0,
      food: Number(form.food) || 0,
      transport: Number(form.transport) || 0,
      other: Number(form.other) || 0
    };
    const calculations = calculateSavings(income, expenses);

    setResult({
      income,
      expenses,
      ...calculations
    });
    setError('');
    setLoading(true);

    const prompt = `The user earns Rs ${income}/month. Their expenses are: rent Rs ${expenses.rent}, food Rs ${expenses.food}, transport Rs ${expenses.transport}, other Rs ${expenses.other}. Their savings are Rs ${Math.round(calculations.savings)} (${formatCompactNumber(calculations.savingsRate)}%). Analyse their financial health in 3 sentences in ${
      lang === 'hi' ? 'Hindi' : 'English'
    }. Give one specific, actionable tip to improve their savings. Be warm and encouraging.`;

    try {
      const data = await requestChat({
        systemPrompt:
          lang === 'hi'
            ? 'You are Riya. Reply only in simple Hindi in 3 short sentences and end with one clear action for today.'
            : 'You are Riya. Reply only in simple English in 3 short sentences and end with one clear action for today.',
        messages: [{ role: 'user', content: prompt }]
      });
      setAnalysis(data.reply || '');
    } catch (requestError) {
      setError(requestError.message || '');
      setAnalysis(
        lang === 'hi'
          ? 'आपकी बचत की दिशा ठीक है। खर्च को थोड़ा और बाँटकर देखें और इस हफ्ते छोटी ऑटो-सेविंग शुरू करें।'
          : 'Your savings are a start. Review one spending area and begin one small auto-saving step this week.'
      );
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setForm({
      income: '18000',
      rent: '6000',
      food: '4000',
      transport: '2000',
      other: '3000'
    });
  }

  const breakdown = result
    ? [
        { key: 'rent', label: lang === 'hi' ? 'किराया' : 'Rent', value: result.expenses.rent, color: '#1D9E75' },
        { key: 'food', label: lang === 'hi' ? 'खाना' : 'Food', value: result.expenses.food, color: '#52B788' },
        {
          key: 'transport',
          label: lang === 'hi' ? 'यातायात' : 'Transport',
          value: result.expenses.transport,
          color: '#84D3B5'
        },
        { key: 'other', label: lang === 'hi' ? 'बाकी' : 'Other', value: result.expenses.other, color: '#B9E6D2' }
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-brand-primary/10 bg-[var(--bg-muted)] p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="m-0 text-base font-semibold text-[var(--text-main)]">
              {lang === 'hi' ? 'Financial Health Check' : 'Financial Health Check'}
            </h2>
            <p className="mt-1 mb-0 text-[12px] leading-5 text-[var(--text-muted)]">
              {lang === 'hi'
                ? 'आमदनी और खर्च भरिए, रिया आपकी बचत की तस्वीर आसान भाषा में बताएगी।'
                : 'Enter income and expenses to see your savings picture in simple words.'}
            </p>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="rounded-full border border-brand-primary/20 bg-white px-3 py-2 text-[11px] font-medium text-brand-dark shadow-sm transition hover:border-brand-primary/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          >
            {lang === 'hi' ? 'Priya demo' : 'Priya demo'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          ['income', lang === 'hi' ? 'मासिक आमदनी' : 'Monthly income'],
          ['rent', lang === 'hi' ? 'किराया' : 'Rent'],
          ['food', lang === 'hi' ? 'खाना' : 'Food'],
          ['transport', lang === 'hi' ? 'यातायात' : 'Transport'],
          ['other', lang === 'hi' ? 'अन्य खर्च' : 'Other expenses']
        ].map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-[var(--text-muted)]">{label}</span>
            <input
              inputMode="numeric"
              value={form[key]}
              onChange={(event) => setForm({ ...form, [key]: event.target.value })}
              className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-3 text-sm text-[var(--text-main)] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              placeholder="0"
            />
          </label>
        ))}

        <button
          type="submit"
          className="w-full rounded-2xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
        >
          {lang === 'hi' ? 'जांच करें' : 'Check health'}
        </button>
      </form>

      {result ? (
        <div className="space-y-4 rounded-[30px] border border-brand-primary/10 bg-[var(--bg-panel)] p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-brand-light p-3">
              <div className="text-[11px] font-medium text-brand-dark">
                {lang === 'hi' ? 'मासिक बचत' : 'Monthly savings'}
              </div>
              <div className="mt-1 text-lg font-semibold text-brand-dark">
                {formatCurrency(result.savings)}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--bg-muted)] p-3">
              <div className="text-[11px] font-medium text-[var(--text-muted)]">
                {lang === 'hi' ? 'बचत दर' : 'Savings rate'}
              </div>
              <div className="mt-1 text-lg font-semibold text-[var(--text-main)]">
                {formatCompactNumber(result.savingsRate)}%
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-[12px] font-medium text-[var(--text-muted)]">
              <span>{lang === 'hi' ? 'खर्च का बंटवारा' : 'Expense breakdown'}</span>
              <span>{formatCurrency(result.totalExpenses)}</span>
            </div>
            <div className="flex h-4 overflow-hidden rounded-full bg-[var(--bg-muted)]">
              {breakdown.map((item) => (
                <div
                  key={item.key}
                  style={{
                    width: `${result.totalExpenses ? (item.value / result.totalExpenses) * 100 : 0}%`,
                    backgroundColor: item.color
                  }}
                />
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {breakdown.map((item) => (
                <div key={item.key} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-medium text-[var(--text-main)]">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-primary/10 bg-brand-light/70 p-4 text-[13px] leading-6 text-brand-dark">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-brand-dark/80">
              {lang === 'hi' ? 'रिया की सलाह' : "Riya's take"}
            </div>
            {error ? <div className="mb-2 text-[12px] text-amber-700">{error}</div> : null}
            {loading ? (
              <span>{lang === 'hi' ? 'रिया सोच रही है...' : 'Riya is thinking...'}</span>
            ) : (
              analysis
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
