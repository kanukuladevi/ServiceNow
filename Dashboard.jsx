import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard({ data, service }) {
  const { expenses, budgets, incomes } = data;

  const dashboardMetrics = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, expense) => {
      const amount = typeof expense.amount === 'object' ? expense.amount.display_value : expense.amount;
      return sum + (parseFloat(amount) || 0);
    }, 0);

    const totalIncome = incomes.reduce((sum, income) => {
      const amount = typeof income.amount === 'object' ? income.amount.display_value : income.amount;
      return sum + (parseFloat(amount) || 0);
    }, 0);

    const totalBudget = budgets.reduce((sum, budget) => {
      const allocated = typeof budget.allocated_amount === 'object' ? budget.allocated_amount.display_value : budget.allocated_amount;
      const active = typeof budget.active === 'object' ? budget.active.display_value : budget.active;
      return sum + (String(active).toLowerCase() === 'true' ? (parseFloat(allocated) || 0) : 0);
    }, 0);

    const netWorth = totalIncome - totalExpenses;

    return {
      totalExpenses,
      totalIncome,
      totalBudget,
      netWorth,
      expenseCount: expenses.length,
      budgetCount: budgets.filter(b => {
        const active = typeof b.active === 'object' ? b.active.display_value : b.active;
        return String(active).toLowerCase() === 'true';
      }).length,
      incomeCount: incomes.length
    };
  }, [expenses, budgets, incomes]);

  const expensesByCategory = useMemo(() => {
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      const category = service.extractFieldValue(expense.category);
      const amount = typeof expense.amount === 'object' ? expense.amount.display_value : expense.amount;
      categoryTotals[category] = (categoryTotals[category] || 0) + (parseFloat(amount) || 0);
    });

    return {
      labels: Object.keys(categoryTotals),
      datasets: [{
        label: 'Expenses by Category',
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', 
          '#9966ff', '#ff9f40', '#ff6384', '#c9cbcf',
          '#4bc0c0', '#ff6384'
        ]
      }]
    };
  }, [expenses, service]);

  const monthlyTrends = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      };
    }).reverse();

    const expensesByMonth = {};
    const incomesByMonth = {};

    expenses.forEach(expense => {
      const date = service.extractFieldValue(expense.expense_date);
      const monthKey = new Date(date).toISOString().slice(0, 7);
      const amount = typeof expense.amount === 'object' ? expense.amount.display_value : expense.amount;
      expensesByMonth[monthKey] = (expensesByMonth[monthKey] || 0) + (parseFloat(amount) || 0);
    });

    incomes.forEach(income => {
      const date = service.extractFieldValue(income.income_date);
      const monthKey = new Date(date).toISOString().slice(0, 7);
      const amount = typeof income.amount === 'object' ? income.amount.display_value : income.amount;
      incomesByMonth[monthKey] = (incomesByMonth[monthKey] || 0) + (parseFloat(amount) || 0);
    });

    return {
      labels: last6Months.map(m => m.month),
      datasets: [
        {
          label: 'Income',
          data: last6Months.map(m => incomesByMonth[m.monthKey] || 0),
          backgroundColor: '#10b981',
        },
        {
          label: 'Expenses',
          data: last6Months.map(m => expensesByMonth[m.monthKey] || 0),
          backgroundColor: '#ef4444',
        }
      ]
    };
  }, [expenses, incomes, service]);

  const budgetProgress = useMemo(() => {
    return budgets
      .filter(budget => {
        const active = typeof budget.active === 'object' ? budget.active.display_value : budget.active;
        return String(active).toLowerCase() === 'true';
      })
      .map(budget => {
        const category = service.extractFieldValue(budget.category);
        const allocated = typeof budget.allocated_amount === 'object' ? budget.allocated_amount.display_value : budget.allocated_amount;
        const spent = typeof budget.spent_amount === 'object' ? budget.spent_amount.display_value : budget.spent_amount;
        
        const allocatedAmount = parseFloat(allocated) || 0;
        const spentAmount = parseFloat(spent) || 0;
        const percentage = allocatedAmount > 0 ? (spentAmount / allocatedAmount) * 100 : 0;
        
        return {
          name: service.extractFieldValue(budget.name),
          category,
          allocated: allocatedAmount,
          spent: spentAmount,
          percentage: Math.min(percentage, 100),
          remaining: Math.max(allocatedAmount - spentAmount, 0)
        };
      });
  }, [budgets, service]);

  const recentTransactions = useMemo(() => {
    const allTransactions = [
      ...expenses.map(expense => ({
        type: 'expense',
        title: service.extractFieldValue(expense.title),
        amount: typeof expense.amount === 'object' ? expense.amount.display_value : expense.amount,
        date: service.extractFieldValue(expense.expense_date),
        category: service.extractFieldValue(expense.category)
      })),
      ...incomes.map(income => ({
        type: 'income',
        title: service.extractFieldValue(income.source),
        amount: typeof income.amount === 'object' ? income.amount.display_value : income.amount,
        date: service.extractFieldValue(income.income_date),
        category: service.extractFieldValue(income.category)
      }))
    ];

    return allTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [expenses, incomes, service]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Financial Overview</h1>
        <p className="dashboard-subtitle">Track your financial health and spending patterns</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card income">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Income</h3>
            <p className="metric-value">{service.formatCurrency(dashboardMetrics.totalIncome)}</p>
            <span className="metric-count">{dashboardMetrics.incomeCount} transactions</span>
          </div>
        </div>

        <div className="metric-card expense">
          <div className="metric-icon">💸</div>
          <div className="metric-content">
            <h3>Total Expenses</h3>
            <p className="metric-value">{service.formatCurrency(dashboardMetrics.totalExpenses)}</p>
            <span className="metric-count">{dashboardMetrics.expenseCount} transactions</span>
          </div>
        </div>

        <div className="metric-card budget">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>Active Budgets</h3>
            <p className="metric-value">{service.formatCurrency(dashboardMetrics.totalBudget)}</p>
            <span className="metric-count">{dashboardMetrics.budgetCount} budgets</span>
          </div>
        </div>

        <div className={`metric-card net-worth ${dashboardMetrics.netWorth >= 0 ? 'positive' : 'negative'}`}>
          <div className="metric-icon">{dashboardMetrics.netWorth >= 0 ? '📈' : '📉'}</div>
          <div className="metric-content">
            <h3>Net Worth</h3>
            <p className="metric-value">{service.formatCurrency(dashboardMetrics.netWorth)}</p>
            <span className="metric-count">Income - Expenses</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <div className="card">
            <h2>Monthly Trends</h2>
            <div className="chart-wrapper">
              <Bar 
                data={monthlyTrends}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return service.formatCurrency(value);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="card">
            <h2>Expenses by Category</h2>
            <div className="chart-wrapper">
              <Doughnut 
                data={expensesByCategory}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right' },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${service.formatCurrency(context.raw)}`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="budget-progress-section">
          <div className="card">
            <h2>Budget Progress</h2>
            {budgetProgress.length === 0 ? (
              <p className="empty-state">No active budgets found. Create a budget to start tracking your spending.</p>
            ) : (
              <div className="budget-list">
                {budgetProgress.map((budget, index) => (
                  <div key={index} className="budget-item">
                    <div className="budget-header">
                      <h4>{budget.name}</h4>
                      <span className="budget-category">{budget.category}</span>
                    </div>
                    <div className="budget-amounts">
                      <span>{service.formatCurrency(budget.spent)} / {service.formatCurrency(budget.allocated)}</span>
                      <span className={`budget-percentage ${budget.percentage > 90 ? 'warning' : budget.percentage > 100 ? 'danger' : ''}`}>
                        {budget.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${budget.percentage > 100 ? 'over-budget' : ''}`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="remaining-amount">
                      {budget.remaining > 0 ? (
                        <span className="text-green-600">Remaining: {service.formatCurrency(budget.remaining)}</span>
                      ) : (
                        <span className="text-red-600">Over budget by: {service.formatCurrency(Math.abs(budget.remaining))}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="recent-transactions-section">
          <div className="card">
            <h2>Recent Transactions</h2>
            {recentTransactions.length === 0 ? (
              <p className="empty-state">No transactions found. Start by adding some income or expenses.</p>
            ) : (
              <div className="transaction-list">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className={`transaction-item ${transaction.type}`}>
                    <div className="transaction-icon">
                      {transaction.type === 'income' ? '💰' : '💸'}
                    </div>
                    <div className="transaction-details">
                      <h4>{transaction.title}</h4>
                      <span className="transaction-category">{transaction.category}</span>
                    </div>
                    <div className="transaction-meta">
                      <div className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}{service.formatCurrency(transaction.amount)}
                      </div>
                      <div className="transaction-date">
                        {service.formatDate(transaction.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}