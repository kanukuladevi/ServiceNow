import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import dashboardPage from '../../client/index.html';

export const personal_finance_dashboard = UiPage({
  $id: Now.ID['dashboard-page'],
  endpoint: 'x_1873497_personal_finance_dashboard.do',
  description: 'Personal Finance Manager Dashboard - Manage expenses, budgets, and income with an intuitive interface',
  category: 'general',
  html: dashboardPage,
  direct: true
});