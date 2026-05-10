import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import type { Expense } from '../types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (filters?: { category?: string; from?: string; to?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAll(filters);
      setExpenses(data);
    } catch {
      setError('Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (expense: Omit<Expense, 'id'>) => {
    await api.add(expense);
    await load();
  };

  const update = async (id: string, expense: Omit<Expense, 'id'>) => {
    await api.update(id, expense);
    await load();
  };

  const remove = async (id: string) => {
    await api.delete(id);
    await load();
  };

  return { expenses, loading, error, load, add, update, remove };
}
