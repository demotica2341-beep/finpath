import { useState } from 'react';
import { requestChat } from '../utils/api';
import {
  calculateEmi,
  formatCompactNumber,
  formatCurrency,
  getEmiRatio,
  getRatioMeta
} from '../utils/finance';

const initialForm = {
  amount: '',
  rate: '',
  months: '',
  income: ''
};

export default function LoanSim({ lang }) {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const amount = Number(form.amount) || 0;
    const rate = Number(form.rate) || 0;
    const months = Number(form.months) || 0;
    const income = Number(form.income) || 0;
    const calculations = calculateEmi(amount, rate, months);
    const ratio = getEmiRatio(calculations.emi, income);

    setResult({
      amount,
      rate,
      months,
      income,
      ratio,
      ...calculations
    });
    setError('');
    setLoading(true);

    const prompt = `User wants to borrow Rs ${amount} at ${rate}% annual interest for ${months} months. Their monthly income is Rs ${income}. Their EMI would be Rs ${Math.round(calculations.emi)} which is ${formatCompactNumber(
      ratio
    )}% of their income. In 2 to 3 sentences in ${
      lang === 'hi' ? 'Hindi' : 'English'
    }, tell them if this loan is advisable and what they should watch out for.`;

    try {
      const data = await requestChat({
        systemPrompt:
          lang === 'hi'
            ? 'You are Riya. Reply only in simple Hindi in 2 or 3 short sentences and end with one clear action for today.'
            : 'You are Riya. Reply only in simple English in 2 or 3 short sentences and end with one clear action for today.',
        messages: [{ role: 'user', content: prompt }]
      });
      setAnalysis(data.reply || '');
    } catch (requestError) {
      setError(requestError.message || '');
      setAnalysis(
        lang === 'hi'
          ? 'EMI आपकी आमदनी के हिसाब से देखनी चाहिए। लोन लेने से पहले कुल ब्याज और किसी सरकारी या सस्ते विकल्प की तुलना जरूर करें।'
          : 'Check whether the EMI fits your monthly income. Compare the total interest and any cheaper government-backed option before saying yes.'
      );
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setForm({
      amount: '50000',
      rate: '14',
      months: '18',
      income: '18000'
    });
  }

  const ratioMeta = result ? getRatioMeta(result.ratio) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-brand-primary/10 bg-[var(--bg-muted)] p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="m-0 text-base font-semibold text-[var(--text-main)]">
              {lang === 'hi' ? 'Loan Simulator' : 'Loan Simulator'}
            </h2>
            <p className="mt-1 mb-0 text-[12px] leading-5 text-[var(--text-muted)]">
              {lang === 'hi'
                ? 'EMI, कुल भुगतान और आमदनी पर असर एक जगह देखिए।'
                : 'See EMI, total repayment, and how heavy the loan feels on your income.'}
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-panel)] p-4 shadow-sm">
        {[
          ['amount', lang === 'hi' ? 'लोन राशि' : 'Loan amount'],
          ['rate', lang === 'hi' ? 'ब्याज दर (%)' : 'Annual interest rate (%)'],
          ['months', lang === 'hi' ? 'महीने' : 'Tenure in months'],
          ['income', lang === 'hi' ? 'मासिक आमदनी' : 'Monthly income']
        ].map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-[var(--text-muted)]">{label}</span>
            <input
              inputMode="numeric"
              value={form[key]}
              onChange={(event) => setForm({ ...form, [key]: event.target.value })}
              className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-3 text-sm text-[var(--text-main)] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              placeholder="0"
            />
          </label>
        ))}

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
        >
          {lang === 'hi' ? 'EMI निकालें' : 'Calculate EMI'}
        </button>
      </form>

      {result ? (
        <div className="space-y-4 rounded-lg border border-brand-primary/10 bg-[var(--bg-panel)] p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-brand-light p-3">
              <div className="text-[11px] font-medium text-brand-dark">
                {lang === 'hi' ? 'मासिक EMI' : 'Monthly EMI'}
              </div>
              <div className="mt-1 text-lg font-semibold text-brand-dark">
                {formatCurrency(result.emi)}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--bg-muted)] p-3">
              <div className="text-[11px] font-medium text-[var(--text-muted)]">
                {lang === 'hi' ? 'आमदनी का हिस्सा' : 'EMI to income'}
              </div>
              <div className="mt-1 text-lg font-semibold text-[var(--text-main)]">
                {formatCompactNumber(result.ratio)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-muted)] p-3">
              <div className="text-[11px] font-medium text-[var(--text-muted)]">
                {lang === 'hi' ? 'कुल भुगतान' : 'Total repayment'}
              </div>
              <div className="mt-1 text-base font-semibold text-[var(--text-main)]">
                {formatCurrency(result.totalRepayment)}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-muted)] p-3">
              <div className="text-[11px] font-medium text-[var(--text-muted)]">
                {lang === 'hi' ? 'कुल ब्याज' : 'Total interest'}
              </div>
              <div className="mt-1 text-base font-semibold text-[var(--text-main)]">
                {formatCurrency(result.totalInterest)}
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${ratioMeta?.chip}`}>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide">
                {lang === 'hi' ? 'EMI जोखिम' : 'EMI risk'}
              </div>
              <div className="mt-1 text-sm font-semibold">{ratioMeta?.label}</div>
            </div>
            <div className={`text-sm font-semibold ${ratioMeta?.tone}`}>
              {formatCompactNumber(result.ratio)}%
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
      ) : (
        <div className="flex min-h-[300px] items-center rounded-lg border border-dashed border-brand-primary/25 bg-brand-light/40 p-6 text-[13px] leading-6 text-brand-dark">
          {lang === 'hi'
            ? 'Priya demo भरकर देखें कि EMI, ब्याज और risk desktop पर साथ-साथ कैसे दिखते हैं।'
            : 'Fill the Priya demo to see EMI, interest, and risk guidance side by side on desktop.'}
        </div>
      )}
      </div>
    </div>
  );
}
