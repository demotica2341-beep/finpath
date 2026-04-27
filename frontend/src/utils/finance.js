export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatCompactNumber(value, digits = 1) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(Number.isFinite(value) ? value : 0);
}

export function calculateSavings(income, expenses) {
  const safeIncome = Number(income) || 0;
  const totalExpenses = Object.values(expenses).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );
  const savings = safeIncome - totalExpenses;
  const savingsRate = safeIncome > 0 ? (savings / safeIncome) * 100 : 0;

  return {
    totalExpenses,
    savings,
    savingsRate
  };
}

export function calculateEmi(principal, annualRate, months) {
  const amount = Number(principal) || 0;
  const rate = Number(annualRate) || 0;
  const tenure = Number(months) || 0;

  if (!amount || !tenure) {
    return {
      emi: 0,
      totalRepayment: 0,
      totalInterest: 0
    };
  }

  const monthlyRate = rate / 12 / 100;

  if (monthlyRate === 0) {
    const emi = amount / tenure;
    return {
      emi,
      totalRepayment: emi * tenure,
      totalInterest: 0
    };
  }

  const factor = Math.pow(1 + monthlyRate, tenure);
  const emi = (amount * monthlyRate * factor) / (factor - 1);
  const totalRepayment = emi * tenure;
  const totalInterest = totalRepayment - amount;

  return {
    emi,
    totalRepayment,
    totalInterest
  };
}

export function getEmiRatio(emi, income) {
  const monthlyIncome = Number(income) || 0;
  if (!monthlyIncome) {
    return 0;
  }
  return (emi / monthlyIncome) * 100;
}

export function getRatioMeta(ratio) {
  if (ratio < 30) {
    return {
      label: 'Comfortable',
      tone: 'text-brand-primary',
      chip: 'bg-brand-light text-brand-dark border-brand-primary/20'
    };
  }
  if (ratio <= 50) {
    return {
      label: 'Tight',
      tone: 'text-brand-amber',
      chip: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  }
  return {
    label: 'High risk',
    tone: 'text-brand-danger',
    chip: 'bg-rose-50 text-rose-700 border-rose-200'
  };
}
