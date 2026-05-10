import { useState } from 'react';
import type { Expense } from '../types';
import ExpenseForm from './ExpenseForm';

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onUpdated: () => void;
}

export default function ExpenseTable({ expenses, onDelete, onUpdated }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (expenses.length === 0) {
    return <p className="text-muted">No expenses found.</p>;
  }

  return (
    <>
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th className="text-end">Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{exp.date}</td>
              <td><span className="badge bg-secondary">{exp.category}</span></td>
              <td>{exp.description}</td>
              <td className="text-end fw-bold">{exp.amount.toFixed(2)} PLN</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setEditingId(exp.id)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(exp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit modal */}
      {editingId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Expense</h5>
                <button className="btn-close" onClick={() => setEditingId(null)} />
              </div>
              <div className="modal-body">
                <ExpenseForm
                  existing={expenses.find(e => e.id === editingId)}
                  onSaved={() => { setEditingId(null); onUpdated(); }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="btn-close" onClick={() => setDeleteId(null)} />
              </div>
              <div className="modal-body">Are you sure you want to delete this expense?</div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => { onDelete(deleteId); setDeleteId(null); }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
