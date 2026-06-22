import { SCHEMES } from '../data/schemes';

export default function Schemes({ lang, onLearnMore }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-brand-primary/10 bg-[var(--bg-muted)] p-4 shadow-sm">
        <h2 className="m-0 text-base font-semibold text-[var(--text-main)]">
          {lang === 'hi' ? 'सरकारी योजनाएँ' : 'Government schemes'}
        </h2>
        <p className="mt-1 mb-0 text-[12px] leading-5 text-[var(--text-muted)]">
          {lang === 'hi'
            ? 'कम लागत वाली योजनाएँ जो बचत, बीमा, पेंशन और छोटे लोन में मदद कर सकती हैं।'
            : 'Low-cost schemes that can help with banking, insurance, pension, and first small loans.'}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {SCHEMES.map((scheme) => (
          <article
            key={scheme.id}
            className="flex min-h-[260px] flex-col rounded-lg border border-brand-primary/10 bg-[var(--bg-panel)] p-4 shadow-sm"
          >
            <div className="inline-flex rounded-full bg-brand-light px-3 py-1 text-[11px] font-semibold text-brand-dark">
              {scheme.name}
            </div>
            <p className="mt-3 mb-0 text-[13px] leading-6 text-[var(--text-main)]">
              {scheme.description}
            </p>

            <div className="mt-4 space-y-2 text-[12px] leading-5 text-[var(--text-muted)]">
              <div>
                <span className="font-semibold text-[var(--text-main)]">
                  {lang === 'hi' ? 'कौन ले सकता है:' : 'Eligibility:'}
                </span>{' '}
                {scheme.eligibility}
              </div>
              <div>
                <span className="font-semibold text-[var(--text-main)]">
                  {lang === 'hi' ? 'फायदा:' : 'Benefit:'}
                </span>{' '}
                {scheme.benefit}
              </div>
            </div>

            <div className="mt-auto flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => onLearnMore(scheme.name)}
                className="rounded-lg bg-brand-primary px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              >
                {lang === 'hi' ? 'रिया से पूछें' : 'Learn more'}
              </button>
              <a
                href={scheme.link}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-medium text-brand-dark underline decoration-brand-primary/35 underline-offset-4"
              >
                {lang === 'hi' ? 'आवेदन लिंक' : 'Apply link'}
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
