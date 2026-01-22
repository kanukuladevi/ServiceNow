import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DecimalColumn, ChoiceColumn } from '@servicenow/sdk/core'

export const x_1873497_personal_expenses = Table({
  name: 'x_1873497_personal_expenses',
  label: 'Expenses',
  schema: {
    title: StringColumn({
      label: 'Title',
      maxLength: 100,
      mandatory: true
    }),
    description: StringColumn({
      label: 'Description',
      maxLength: 255
    }),
    amount: DecimalColumn({
      label: 'Amount',
      mandatory: true
    }),
    expense_date: DateColumn({
      label: 'Expense Date',
      mandatory: true,
      default: 'javascript:gs.nowDateTime()'
    }),
    category: ChoiceColumn({
      label: 'Category',
      mandatory: true,
      choices: {
        food: { label: 'Food & Dining', sequence: 0 },
        transportation: { label: 'Transportation', sequence: 1 },
        housing: { label: 'Housing', sequence: 2 },
        utilities: { label: 'Utilities', sequence: 3 },
        healthcare: { label: 'Healthcare', sequence: 4 },
        entertainment: { label: 'Entertainment', sequence: 5 },
        shopping: { label: 'Shopping', sequence: 6 },
        education: { label: 'Education', sequence: 7 },
        travel: { label: 'Travel', sequence: 8 },
        other: { label: 'Other', sequence: 9 }
      },
      dropdown: 'dropdown_with_none'
    }),
    payment_method: ChoiceColumn({
      label: 'Payment Method',
      mandatory: true,
      choices: {
        cash: { label: 'Cash', sequence: 0 },
        credit_card: { label: 'Credit Card', sequence: 1 },
        debit_card: { label: 'Debit Card', sequence: 2 },
        bank_transfer: { label: 'Bank Transfer', sequence: 3 },
        other: { label: 'Other', sequence: 4 }
      },
      dropdown: 'dropdown_with_none'
    })
  },
  display: 'title',
  accessible_from: 'public',
  actions: ['create', 'read', 'update', 'delete'],
  allow_web_service_access: true
})