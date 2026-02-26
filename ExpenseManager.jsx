import React, { useState } from 'react';
export default function ExpenseManager({ expenses, service, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    expense_date: new Date().toISOString().slice(0, 10),
    category: '',
    payment_method: ''
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await service.updateExpense(service.extractSysId(editingExpense.sys_id), formData);
      } else {
        await service.createExpense(formData);
      }
      
      resetForm();
      onUpdate();
    } catch (error) {
      console.error('Failed to save expense:', error);
      alert('Failed to save expense. Please try again.');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: service.extractFieldValue(expense.title),
      description: service.extractFieldValue(expense.description) || '',
      amount: service.extractFieldValue(expense.amount),
      expense_date: service.extractFieldValue(expense.expense_date),
      category: service.extractFieldValue(expense.category),
      payment_method: service.extractFieldValue(expense.payment_method)
    });
    setShowForm(true);
  };

  const handleDelete = async (expense) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await service.deleteExpense(service.extractSysId(expense.sys_id));
        onUpdate();
      } catch (error) {
        console.error('Failed to delete expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      amount: '',
      expense_date: new Date().toISOString().slice(0, 10),
      category: '',
      payment_method: ''
    });
    setEditingExpense(null);
    setShowForm(false);
  };

  const totalExpenses = expenses.reduce((sum, expense) => {
    const amount = service.extractFieldValue(expense.amount);
    return sum + (parseFloat(amount) || 0);
  }, 0);

  return (
    <div className="expense-manager">
      <div className="manager-header">
        <div>
          <h1>💸 Expense Management</h1>
          <p>Track and manage your expenses</p>
          <div className="summary-stats">
            <span className="stat-item">
              Total: <strong>{service.formatCurrency(totalExpenses)}</strong>
            </span>
            <span className="stat-item">
              Count: <strong>{expenses.length}</strong>
            </span>
          </div>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {showForm && (
        <div className="card form-container">
          <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="food">Food & Dining</option>
                  <option value="transportation">Transportation</option>
                  <option value="housing">Housing</option>
                  <option value="utilities">Utilities</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="shopping">Shopping</option>
                  <option value="education">Education</option>
                  <option value="travel">Travel</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method *</label>
                <select
                  className="form-select"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.expense_date}
                  onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Optional description"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Expense History</h2>
        {expenses.length === 0 ? (
          <p className="empty-state">No expenses found. Add your first expense to get started.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={service.extractSysId(expense.sys_id)}>
                    <td>{service.formatDate(service.extractFieldValue(expense.expense_date))}</td>
                    <td>
                      <div>
                        <strong>{service.extractFieldValue(expense.title)}</strong>
                        {service.extractFieldValue(expense.description) && (
                          <div className="text-gray-500" style={{fontSize: '0.75rem'}}>
                            {service.extractFieldValue(expense.description)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">
                        {service.extractFieldValue(expense.category)}
                      </span>
                    </td>
                    <td>{service.extractFieldValue(expense.payment_method)}</td>
                    <td className="text-red-600 font-semibold">
                      {service.formatCurrency(service.extractFieldValue(expense.amount))}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEdit(expense)}
                          style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(expense)}
                          style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
