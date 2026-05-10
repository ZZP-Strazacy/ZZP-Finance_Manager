import type { Expense, MonthlySummary, CategoryBreakdown } from './types';

const BASE = import.meta.env.VITE_API_URL ?? '/api/expenses';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: 'include', ...options });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getAll: (params?: { category?: string; from?: string; to?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    const qs = query.toString();
    return request<Expense[]>(`${BASE}${qs ? `?${qs}` : ''}`);
  },

  add: (expense: Omit<Expense, 'id'>) =>
    request<Expense>(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    }),

  update: (id: string, expense: Omit<Expense, 'id'>) =>
    request<Expense>(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    }),

  delete: (id: string) =>
    request<void>(`${BASE}/${id}`, { method: 'DELETE' }),

  getMonthlySummary: (year: number, month: number) =>
    request<MonthlySummary>(`${BASE}/summary?year=${year}&month=${month}`),

  getCategoryBreakdown: (year: number, month: number) =>
    request<CategoryBreakdown>(`${BASE}/summary/categories?year=${year}&month=${month}`),
};
