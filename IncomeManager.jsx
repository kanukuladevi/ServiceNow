import React, { useState } from 'react';

export default function IncomeManager({ incomes, service, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [formData, setFormData] = useState({
    source: '',
    description: '',
    amount: '',
    income_date: new Date().toISOString().slice(0, 10),
    category: '',
    recurring: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIncome) {
        await service.updateIncome(service.extractSysId(editingIncome.sys_id), formData);
      } else {
        await service.createIncome(formData);
      }
      
      resetForm();
      onUpdate();
    } catch (error) {
      console.error('Failed to save income:', error);
      alert('Failed to save income. Please try again.');
    }
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setFormData({
      source: service.extractFieldValue(income.source),
      description: service.extractFieldValue(income.description) || '',
      amount: service.extractFieldValue(income.amount),
      income_date: service.extractFieldValue(income.income_date),
      category: service.extractFieldValue(income.category),
      recurring: String(service.extractFieldValue(income.recurring)).toLowerCase() === 'true'
    });
    setShowForm(true);
  };

  const handleDelete = async (income) => {
    if (confirm('Are you sure you want to delete this income entry?')) {
      try {
        await service.deleteIncome(service.extractSysId(income.sys_id));
        onUpdate();
      } catch (error) {
        console.error('Failed to delete income:', error);
        alert('Failed to delete income. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      source: '',
      description: '',
      amount: '',
      income_date: new Date().toISOString().slice(0, 10),
      category: '',
      recurring: false
    });
    setEditingIncome(null);
    setShowForm(false);
  };

  const totalIncome = incomes.reduce((sum, income) => {
    const amount = service.extractFieldValue(income.amount);
    return sum + (parseFloat(amount) || 0);
  }, 0);

  const recurringIncome = incomes
    .filter(income => String(service.extractFieldValue(income.recurring)).toLowerCase() === 'true')
    .reduce((sum, income) => {
      const amount = service.extractFieldValue(income.amount);
      return sum + (parseFloat(amount) || 0);
    }, 0);

  return (
    <div className="income-manager">
      <div className="manager-header">
        <div>
          <h1>💵 Income Management</h1>
          <p>Track and manage your income sources</p>
          <div className="summary-stats">
            <span className="stat-item">
              Total: <strong>{service.formatCurrency(totalIncome)}</strong>
            </span>
            <span className="stat-item">
              Recurring: <strong>{service.formatCurrency(recurringIncome)}</strong>
            </span>
            <span className="stat-item">
              Count: <strong>{incomes.length}</strong>
            </span>
          </div>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Income'}
        </button>
      </div>

      {showForm && (
        <div className="card form-container">
          <h2>{editingIncome ? 'Edit Income' : 'Add New Income'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Income Source *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  required
                  placeholder="e.g., Salary, Freelance Project, Rental Income"
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
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="investment">Investment</option>
                  <option value="rental">Rental Income</option>
                  <option value="bonus">Bonus</option>
                  <option value="gift">Gift</option>
                  <option value="refund">Refund</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.income_date}
                  onChange={(e) => setFormData({...formData, income_date: e.target.value})}
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
                placeholder="Optional description or notes"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  checked={formData.recurring}
                  onChange={(e) => setFormData({...formData, recurring: e.target.checked})}
                  style={{marginRight: '0.5rem'}}
                />
                Recurring Income (e.g., monthly salary, weekly payments)
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                {editingIncome ? 'Update Income' : 'Add Income'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Income History</h2>
        {incomes.length === 0 ? (
          <p className="empty-state">No income records found. Add your first income entry to get started.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={service.extractSysId(income.sys_id)}>
                    <td>{service.formatDate(service.extractFieldValue(income.income_date))}</td>
                    <td>
                      <div>
                        <strong>{service.extractFieldValue(income.source)}</strong>
                        {service.extractFieldValue(income.description) && (
                          <div className="text-gray-500" style={{fontSize: '0.75rem'}}>
                            {service.extractFieldValue(income.description)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="category-badge income-category">
                        {service.extractFieldValue(income.category)}
                      </span>
                    </td>
                    <td>
                      {String(service.extractFieldValue(income.recurring)).toLowerCase() === 'true' ? (
                        <span className="recurring-badge">Recurring</span>
                      ) : (
                        <span className="one-time-badge">One-time</span>
                      )}
                    </td>
                    <td className="text-green-600 font-semibold">
                      {service.formatCurrency(service.extractFieldValue(income.amount))}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEdit(income)}
                          style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(income)}
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