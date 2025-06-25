export interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface ExpenseFormData {
  amount: number | null;
  category: string;
  description: string;
  date: string;
}

export type ExpenseCategory = 
  | 'Food'
  | 'Transportation'
  | 'Housing'
  | 'Utilities'
  | 'Entertainment'
  | 'Shopping'
  | 'Healthcare'
  | 'Other'; 