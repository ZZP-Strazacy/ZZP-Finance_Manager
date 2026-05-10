import { useState, useEffect } from 'react';
import { api } from '../api';
import type { MonthlySummary, CategoryBreakdown } from '../types';

export default function Summary() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown>({});

  useEffect(() => {
    api.getMonthlySummary(year, month).then(setSummary).catch(() => setSummary(null));
    api.getCategoryBreakdown(year, month).then(setBreakdown).catch(() => setBreakdown({}));
  }, [year, month]);

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div>
      <h2 className="mb-4">Monthly Summary</h2>

      <div className="row g-2 align-items-end mb-4">
        <div className="col-auto">
          <label className="form-label">Year</label>
          <input type="number" className="form-control" value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: 100 }} />
        </div>
        <div className="col-auto">
          <label className="form-label">Month</label>
          <input type="number" className="form-control" value={month} min={1} max={12} onChange={e => setMonth(Number(e.target.value))} style={{ width: 80 }} />
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{monthName}</h5>
          <p className="fs-3 fw-bold text-primary">{summary ? `${summary.total.toFixed(2)} PLN` : '—'}</p>
        </div>
      </div>

      <h5 className="mb-3">Breakdown by category</h5>
      {Object.keys(breakdown).length === 0 ? (
        <p className="text-muted">No expenses for this period.</p>
      ) : (
        <ul className="list-group">
          {Object.entries(breakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, total]) => (
              <li key={cat} className="list-group-item d-flex justify-content-between align-items-center">
                {cat}
                <span className="badge bg-primary rounded-pill">{total.toFixed(2)} PLN</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
