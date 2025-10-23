export interface TaxBracket {
  limit: number;
  rate: number;
  label: string;
}

export interface TaxBreakdown {
  bracket: string;
  taxableAmount: number;
  rate: number;
  tax: number;
}

export interface TaxResult {
  monthlyIncome: number;
  annualIncome: number;
  totalTax: number;
  monthlyTax: number;
  takeHomePay: number;
  effectiveRate: number;
  breakdown: TaxBreakdown[];
  topBracket: string;
}

export const TAX_BRACKETS: TaxBracket[] = [
  { limit: 500000, rate: 0, label: '0 - 500k' },
  { limit: 1000000, rate: 0.07, label: '500k - 1M' },
  { limit: 2000000, rate: 0.11, label: '1M - 2M' },
  { limit: 4000000, rate: 0.15, label: '2M - 4M' },
  { limit: 6000000, rate: 0.19, label: '4M - 6M' },
  { limit: 8000000, rate: 0.21, label: '6M - 8M' },
  { limit: Infinity, rate: 0.24, label: '8M+' },
];

export const calculateTax = (monthlyIncome: number): TaxResult => {
  const annualIncome = monthlyIncome * 12;
  let totalTax = 0;
  let previousLimit = 0;
  const breakdown: TaxBreakdown[] = [];
  let topBracket = '';

  for (const bracket of TAX_BRACKETS) {
    if (annualIncome > previousLimit) {
      const taxableInBracket = Math.min(annualIncome, bracket.limit) - previousLimit;
      const taxForBracket = taxableInBracket * bracket.rate;

      if (taxableInBracket > 0) {
        breakdown.push({
          bracket: bracket.label,
          taxableAmount: taxableInBracket,
          rate: bracket.rate,
          tax: taxForBracket,
        });
        totalTax += taxForBracket;
        topBracket = bracket.label;
      }

      previousLimit = bracket.limit;
    }
  }

  const monthlyTax = totalTax / 12;
  const effectiveRate = (totalTax / annualIncome) * 100;

  return {
    monthlyIncome,
    annualIncome,
    totalTax,
    monthlyTax,
    takeHomePay: monthlyIncome - monthlyTax,
    effectiveRate,
    breakdown,
    topBracket,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateInsight = (result: TaxResult): string => {
  const { annualIncome, effectiveRate, topBracket } = result;

  if (annualIncome <= 500000) {
    return "You're tax-free! Your income falls below the taxable threshold.";
  }

  if (annualIncome > 8000000) {
    return `You fall into the 24% bracket — about ${effectiveRate.toFixed(1)}% of your yearly income goes to tax. You're in the top earning tier!`;
  }

  if (annualIncome > 4000000) {
    return `Your effective tax rate is ${effectiveRate.toFixed(1)}%. You're in the ${topBracket} bracket, placing you among higher earners in Nigeria.`;
  }

  if (annualIncome > 2000000) {
    return `You're in the ${topBracket} bracket with an effective rate of ${effectiveRate.toFixed(1)}%. Your tax contribution supports national development.`;
  }

  return `Your effective tax rate is ${effectiveRate.toFixed(1)}%. You're in the ${topBracket} bracket, and you're doing great!`;
};
