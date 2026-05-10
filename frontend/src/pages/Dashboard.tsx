import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useExpenses } from '../hooks/useExpenses';
import type { MonthlySummary } from '../types';

export default function Dashboard() {
  const { expenses, loading } = useExpenses();
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const now = new Date();

  useEffect(() => {
    api.getMonthlySummary(now.getFullYear(), now.getMonth() + 1)
      .then(setSummary)
      .catch(() => {});
  }, []);

  const recent = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h6 className="card-title">This month's total</h6>
              <p className="card-text fs-3 fw-bold">
                {summary ? `${summary.total.toFixed(2)} PLN` : '—'}
              </p>
              <small>{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-secondary">
            <div className="card-body">
              <h6 className="card-title">Total expenses</h6>
              <p className="card-text fs-3 fw-bold">{loading ? '…' : expenses.length}</p>
              <small>all time</small>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Recent expenses</h5>
        <Link to="/expenses" className="btn btn-sm btn-outline-primary">View all</Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-muted">No expenses yet. <Link to="/add">Add one</Link>.</p>
      ) : (
        <table className="table table-sm table-hover">
          <thead><tr><th>Date</th><th>Category</th><th>Description</th><th className="text-end">Amount</th></tr></thead>
          <tbody>
            {recent.map(e => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td><span className="badge bg-secondary">{e.category}</span></td>
                <td>{e.description}</td>
                <td className="text-end">{e.amount.toFixed(2)} PLN</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
