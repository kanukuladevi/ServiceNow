import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DecimalColumn, ChoiceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_1873497_personal_budgets = Table({
  name: 'x_1873497_personal_budgets',
  label: 'Budgets',
  schema: {
    name: StringColumn({
      label: 'Budget Name',
      maxLength: 100,
      mandatory: true
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
    allocated_amount: DecimalColumn({
      label: 'Allocated Amount',
      mandatory: true
    }),
    spent_amount: DecimalColumn({
      label: 'Spent Amount',
      default: '0.00'
    }),
    start_date: DateColumn({
      label: 'Start Date',
      mandatory: true
    }),
    end_date: DateColumn({
      label: 'End Date',
      mandatory: true
    }),
    active: BooleanColumn({
      label: 'Active',
      default: true
    })
  },
  display: 'name',
  accessible_from: 'public',
  actions: ['create', 'read', 'update', 'delete'],
  allow_web_service_access: true
})