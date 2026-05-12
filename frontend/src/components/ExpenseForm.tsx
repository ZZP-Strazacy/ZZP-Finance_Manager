import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { Expense } from '../types';
import { CATEGORIES } from '../constants';

interface Props {
  existing?: Expense;
  onSaved?: () => void;
}

export default function ExpenseForm({ existing, onSaved }: Props) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existing) {
      setAmount(String(existing.amount));
      setCategory(existing.category);
      setDate(existing.date);
      setDescription(existing.description);
    }
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    if (!date) {
      setError('Date is required.');
      return;
    }

    if (new Date(date) > new Date()) {
      setError('Date cannot be in the future.');
      return;
    }

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    const payload = { amount: parsed, category, date, description };
    try {
      if (existing) {
        await api.update(existing.id, payload);
      } else {
        await api.add(payload);
      }
      onSaved ? onSaved() : navigate('/expenses');
    } catch {
      setError('Failed to save expense.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Amount (PLN)</label>
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Date</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {existing ? 'Save changes' : 'Add expense'}
      </button>
    </form>
  );
}
