import { useExpenses } from '../hooks/useExpenses';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseTable from '../components/ExpenseTable';

export default function ExpenseList() {
  const { expenses, loading, error, load, remove } = useExpenses();

  const handleFilter = (filters: { category: string; from: string; to: string }) => {
    load({
      category: filters.category || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    });
  };

  return (
    <div>
      <h2 className="mb-4">Expenses</h2>
      <ExpenseFilters onFilter={handleFilter} />
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ExpenseTable expenses={expenses} onDelete={remove} onUpdated={() => load()} />
      )}
    </div>
  );
}
