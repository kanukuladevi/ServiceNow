import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DecimalColumn, ChoiceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_1873497_personal_incomes = Table({
  name: 'x_1873497_personal_incomes',
  label: 'Incomes',
  schema: {
    source: StringColumn({
      label: 'Income Source',
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
    income_date: DateColumn({
      label: 'Income Date',
      mandatory: true,
      default: 'javascript:gs.nowDateTime()'
    }),
    category: ChoiceColumn({
      label: 'Category',
      mandatory: true,
      choices: {
        salary: { label: 'Salary', sequence: 0 },
        freelance: { label: 'Freelance', sequence: 1 },
        investment: { label: 'Investment', sequence: 2 },
        rental: { label: 'Rental Income', sequence: 3 },
        bonus: { label: 'Bonus', sequence: 4 },
        gift: { label: 'Gift', sequence: 5 },
        refund: { label: 'Refund', sequence: 6 },
        other: { label: 'Other', sequence: 7 }
      },
      dropdown: 'dropdown_with_none'
    }),
    recurring: BooleanColumn({
      label: 'Recurring',
      default: false
    })
  },
  display: 'source',
  accessible_from: 'public',
  actions: ['create', 'read', 'update', 'delete'],
  allow_web_service_access: true
})