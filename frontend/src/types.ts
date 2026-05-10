export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface MonthlySummary {
  year: number;
  month: number;
  total: number;
}

export type CategoryBreakdown = Record<string, number>;
