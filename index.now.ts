import '@servicenow/sdk/global'

// Import all table definitions
import { x_1873497_personal_expenses } from './tables/expenses.now.ts'
import { x_1873497_personal_budgets } from './tables/budgets.now.ts'
import { x_1873497_personal_incomes } from './tables/incomes.now.ts'

// Import UI page
import { personal_finance_dashboard } from './ui-pages/dashboard.now.ts'