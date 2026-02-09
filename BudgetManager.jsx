import React, { useState } from 'react';

export default function BudgetManager({ budgets, service, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    allocated_amount: '',
    spent_amount: '0',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: '',
    active: true
  });
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await service.updateBudget(service.extractSysId(editingBudget.sys_id), formData);
      } else {
        await service.createBudget(formData);
      }
      
      resetForm();
      onUpdate();
    } catch (error) {
      console.error('Failed to save budget:', error);
      alert('Failed to save budget. Please try again.');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      name: service.extractFieldValue(budget.name),
      category: service.extractFieldValue(budget.category),
      allocated_amount: service.extractFieldValue(budget.allocated_amount),
      spent_amount: service.extractFieldValue(budget.spent_amount) || '0',
      start_date: service.extractFieldValue(budget.start_date),
      end_date: service.extractFieldValue(budget.end_date),
      active: String(service.extractFieldValue(budget.active)).toLowerCase() === 'true'
    });
    setShowForm(true);
  };

  const handleDelete = async (budget) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        await service.deleteBudget(service.extractSysId(budget.sys_id));
        onUpdate();
      } catch (error) {
        console.error('Failed to delete budget:', error);
        alert('Failed to delete budget. Please try again.');
      }
    }
  };

  const resetForm = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    setFormData({
      name: '',
      category: '',
      allocated_amount: '',
      spent_amount: '0',
      start_date: new Date().toISOString().slice(0, 10),
      end_date: nextMonth.toISOString().slice(0, 10),
      active: true
    });
    setEditingBudget(null);
    setShowForm(false);
  };

  const totalBudgeted = budgets
    .filter(budget => String(service.extractFieldValue(budget.active)).toLowerCase() === 'true')
    .reduce((sum, budget) => {
      const allocated = service.extractFieldValue(budget.allocated_amount);
      return sum + (parseFloat(allocated) || 0);
    }, 0);

  const totalSpent = budgets
    .filter(budget => String(service.extractFieldValue(budget.active)).toLowerCase() === 'true')
    .reduce((sum, budget) => {
      const spent = service.extractFieldValue(budget.spent_amount);
      return sum + (parseFloat(spent) || 0);
    }, 0);

  return (
    <div className="budget-manager">
      <div className="manager-header">
        <div>
          <h1>🎯 Budget Management</h1>
          <p>Set and track your spending limits</p>
          <div className="summary-stats">
            <span className="stat-item">
              Budgeted: <strong>{service.formatCurrency(totalBudgeted)}</strong>
            </span>
            <span className="stat-item">
              Spent: <strong>{service.formatCurrency(totalSpent)}</strong>
            </span>
            <span className="stat-item">
              Remaining: <strong className={totalBudgeted - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}>
                {service.formatCurrency(totalBudgeted - totalSpent)}
              </strong>
            </span>
          </div>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Create Budget'}
        </button>
      </div>

      {showForm && (
        <div className="card form-container">
          <h2>{editingBudget ? 'Edit Budget' : 'Create New Budget'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Budget Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g., Monthly Food Budget"
                />
              </div>
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
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Allocated Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.allocated_amount}
                  onChange={(e) => setFormData({...formData, allocated_amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Spent Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.spent_amount}
                  onChange={(e) => setFormData({...formData, spent_amount: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  style={{marginRight: '0.5rem'}}
                />
                Active Budget
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingBudget ? 'Update Budget' : 'Create Budget'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Your Budgets</h2>
        {budgets.length === 0 ? (
          <p className="empty-state">No budgets found. Create your first budget to start tracking your spending limits.</p>
        ) : (
          <div className="budget-grid">
            {budgets.map((budget) => {
              const allocated = parseFloat(service.extractFieldValue(budget.allocated_amount)) || 0;
              const spent = parseFloat(service.extractFieldValue(budget.spent_amount)) || 0;
              const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
              const isActive = String(service.extractFieldValue(budget.active)).toLowerCase() === 'true';
              
              return (
                <div key={service.extractSysId(budget.sys_id)} className={`budget-card ${!isActive ? 'inactive' : ''}`}>
                  <div className="budget-card-header">
                    <h3>{service.extractFieldValue(budget.name)}</h3>
                    <div className="budget-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(budget)}
                        style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(budget)}
                        style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="budget-details">
                    <span className="budget-category">{service.extractFieldValue(budget.category)}</span>
                    {!isActive && <span className="inactive-badge">Inactive</span>}
                  </div>
                  
                  <div className="budget-amounts">
                    <div className="amount-row">
                      <span>Spent:</span>
                      <span className="amount-value">{service.formatCurrency(spent)}</span>
                    </div>
                    <div className="amount-row">
                      <span>Budget:</span>
                      <span className="amount-value">{service.formatCurrency(allocated)}</span>
                    </div>
                    <div className="amount-row">
                      <span>Remaining:</span>
                      <span className={`amount-value ${allocated - spent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {service.formatCurrency(allocated - spent)}
                      </span>
                    </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-header">
                      <span className="progress-label">Progress</span>
                      <span className={`progress-percentage ${percentage > 90 ? 'warning' : percentage > 100 ? 'danger' : ''}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${percentage > 100 ? 'over-budget' : ''}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="budget-period">
                    <span>
                      {service.formatDate(service.extractFieldValue(budget.start_date))} - 
                      {service.formatDate(service.extractFieldValue(budget.end_date))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
