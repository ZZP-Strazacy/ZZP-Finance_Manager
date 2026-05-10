import ExpenseForm from '../components/ExpenseForm';

export default function AddExpense() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4">Add Expense</h2>
        <ExpenseForm />
      </div>
    </div>
  );
}
