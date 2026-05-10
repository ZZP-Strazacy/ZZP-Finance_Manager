import { useState } from 'react';
import { CATEGORIES } from '../constants';

interface Filters {
  category: string;
  from: string;
  to: string;
}

interface Props {
  onFilter: (filters: Filters) => void;
}

export default function ExpenseFilters({ onFilter }: Props) {
  const [category, setCategory] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const apply = () => onFilter({ category, from, to });
  const reset = () => {
    setCategory(''); setFrom(''); setTo('');
    onFilter({ category: '', from: '', to: '' });
  };

  return (
    <div className="row g-2 align-items-end mb-3">
      <div className="col-auto">
        <label className="form-label mb-1">Category</label>
        <select className="form-select form-select-sm" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="col-auto">
        <label className="form-label mb-1">From</label>
        <input type="date" className="form-control form-control-sm" value={from} onChange={e => setFrom(e.target.value)} />
      </div>
      <div className="col-auto">
        <label className="form-label mb-1">To</label>
        <input type="date" className="form-control form-control-sm" value={to} onChange={e => setTo(e.target.value)} />
      </div>
      <div className="col-auto d-flex gap-2">
        <button className="btn btn-sm btn-primary" onClick={apply}>Filter</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
