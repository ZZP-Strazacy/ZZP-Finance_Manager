import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-4">
      <span className="navbar-brand fw-bold">Finance Manager</span>
      <div className="navbar-nav">
        <NavLink className="nav-link" to="/">Dashboard</NavLink>
        <NavLink className="nav-link" to="/expenses">Expenses</NavLink>
        <NavLink className="nav-link" to="/add">Add Expense</NavLink>
        <NavLink className="nav-link" to="/summary">Summary</NavLink>
      </div>
    </nav>
  );
}
