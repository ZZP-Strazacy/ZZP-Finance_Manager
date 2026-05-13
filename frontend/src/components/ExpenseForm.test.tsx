import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ExpenseForm from './ExpenseForm';

vi.mock('../api', () => ({
  api: {
    add: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
  }
}));

const renderForm = () => render(
  <MemoryRouter>
    <ExpenseForm />
  </MemoryRouter>
);

describe('ExpenseForm', () => {
  it('renders form fields', () => {
    renderForm();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    expect(document.querySelector('input[type="date"]')).toBeInTheDocument();
    expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
  });

  it('shows error when amount is negative', async () => {
    renderForm();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '-5' } });
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2025-01-01' } });
    const descInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    fireEvent.change(descInput, { target: { value: 'test' } });
    fireEvent.submit(screen.getByRole('button', { name: /add expense/i }).closest('form')!);
    expect(await screen.findByText(/must be greater than 0/i)).toBeInTheDocument();
});

  it('shows error when date is in the future', async () => {
    renderForm();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '50' } });
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2099-01-01' } });
    const descInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    fireEvent.change(descInput, { target: { value: 'test' } });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
    expect(await screen.findByText(/cannot be in the future/i)).toBeInTheDocument();
  });

  it('shows error when description is empty', async () => {
    renderForm();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '50' } });
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2025-01-01' } });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
    expect(await screen.findByText(/description is required/i)).toBeInTheDocument();
  });
});