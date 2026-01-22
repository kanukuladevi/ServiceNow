import React, { useEffect, useState, useMemo } from 'react';
import { FinanceService } from './services/FinanceService.js';
import Dashboard from './components/Dashboard.jsx';
import ExpenseManager from './components/ExpenseManager.jsx';
import BudgetManager from './components/BudgetManager.jsx';
import IncomeManager from './components/IncomeManager.jsx';
import './app.css';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [data, setData] = useState({
    expenses: [],
    budgets: [],
    incomes: []
  });
  const [loading, setLoading] = useState(true);
  
  const financeService = useMemo(() => new FinanceService(), []);

  useEffect(() => {
    loadData();
  }, [financeService]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expenses, budgets, incomes] = await Promise.all([
        financeService.getExpenses(),
        financeService.getBudgets(),
        financeService.getIncomes()
      ]);
      
      setData({ expenses, budgets, incomes });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="finance-app">
      <nav className="main-nav">
        <div className="nav-brand">
          <h1>💰 Personal Finance Manager</h1>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-link ${currentView === 'expenses' ? 'active' : ''}`}
            onClick={() => setCurrentView('expenses')}
          >
            💸 Expenses
          </button>
          <button 
            className={`nav-link ${currentView === 'budgets' ? 'active' : ''}`}
            onClick={() => setCurrentView('budgets')}
          >
            🎯 Budgets
          </button>
          <button 
            className={`nav-link ${currentView === 'incomes' ? 'active' : ''}`}
            onClick={() => setCurrentView('incomes')}
          >
            💵 Income
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard data={data} service={financeService} />
        )}
        {currentView === 'expenses' && (
          <ExpenseManager 
            expenses={data.expenses} 
            service={financeService} 
            onUpdate={refreshData} 
          />
        )}
        {currentView === 'budgets' && (
          <BudgetManager 
            budgets={data.budgets} 
            service={financeService} 
            onUpdate={refreshData} 
          />
        )}
        {currentView === 'incomes' && (
          <IncomeManager 
            incomes={data.incomes} 
            service={financeService} 
            onUpdate={refreshData} 
          />
        )}
      </main>
    </div>
  );
}