export class FinanceService {
  constructor() {
    this.baseHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-UserToken": window.g_ck
    };
  }

  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch (parseError) {
        console.warn('Could not parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data.result || [];
  }

  // Expense Management
  async getExpenses(filters = {}) {
    try {
      const searchParams = new URLSearchParams({
        ...filters,
        sysparm_display_value: 'all',
        sysparm_limit: '1000',
        sysparm_order_by: '-expense_date'
      });

      const response = await fetch(`/api/now/table/x_1873497_personal_expenses?${searchParams.toString()}`, {
        method: "GET",
        headers: this.baseHeaders,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      throw error;
    }
  }

  async createExpense(expenseData) {
    try {
      const response = await fetch('/api/now/table/x_1873497_personal_expenses', {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(expenseData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create expense:', error);
      throw error;
    }
  }

  async updateExpense(sysId, expenseData) {
    try {
      const response = await fetch(`/api/now/table/x_1873497_personal_expenses/${sysId}`, {
        method: "PATCH",
        headers: this.baseHeaders,
        body: JSON.stringify(expenseData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  }

  async deleteExpense(sysId) {
    try {
      const response = await fetch(`/api/now/table/x_1873497_personal_expenses/${sysId}`, {
        method: "DELETE",
        headers: this.baseHeaders,
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  }

  // Budget Management
  async getBudgets(filters = {}) {
    try {
      const searchParams = new URLSearchParams({
        ...filters,
        sysparm_display_value: 'all',
        sysparm_limit: '1000',
        sysparm_order_by: '-start_date'
      });

      const response = await fetch(`/api/now/table/x_1873497_personal_budgets?${searchParams.toString()}`, {
        method: "GET",
        headers: this.baseHeaders,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      throw error;
    }
  }

  async createBudget(budgetData) {
    try {
      const response = await fetch('/api/now/table/x_1873497_personal_budgets', {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(budgetData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create budget:', error);
      throw error;
    }
  }

  async updateBudget(sysId, budgetData) {
    try {
      const response = await fetch(`/api/now/table/x_1873497_personal_budgets/${sysId}`, {
        method: "PATCH",
        headers: this.baseHeaders,
        body: JSON.stringify(budgetData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to update budget:', error);
      throw error;
    }
  }

  async deleteBudget(sysId) {
    try {
      const response = await fetch(`/api/now/table/x_1873497_personal_budgets/${sysId}`, {
        method: "DELETE",
        headers: this.baseHeaders,
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete budget:', error);
      throw error;
    }
  }

  // Income Management
  async getIncomes(filters = {}) {
    try {
      const searchParams = new URLSearchParams({
        ...filters,
        sysparm_display_value: 'all',
        sysparm_limit: '1000',
        sysparm_order_by: '-income_date'
      });

      const response = await fetch(`/api/now/table/x_1873497_personal_incomes?${searchParams.toString()}`, {
        method: "GET",
        headers: this.baseHeaders,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch incomes:', error);
      throw error;
    }
  }

  async createIncome(incomeData) {
    try {
      const response = await fetch('/api/now/table/x_1873497_personal_incomes', {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(incomeData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create income:', error);
      throw error;
    }
  }

  async updateIncome(sysId, incomeData) {
    try {
      const response = await fetch(`/api/now/table/x_1873497_personal_incomes/${sysId}`, {
        method: "PATCH",
        headers: this.baseHeaders,
        body: JSON.stringify(incomeData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Failed to update income:', error);
      throw error;
    }
  }

  async deleteIncome(sysId) {
    try {
      const response = await fetch(`/api/now/table/x_1873497_personal_incomes/${sysId}`, {
        method: "DELETE",
        headers: this.baseHeaders,
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete income:', error);
      throw error;
    }
  }

  // Utility Methods
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount) || 0);
  }

  extractFieldValue(field) {
    return typeof field === 'object' ? field.display_value : field;
  }

  extractSysId(field) {
    return typeof field === 'object' ? field.value : field;
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}