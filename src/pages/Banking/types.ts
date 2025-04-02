
export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  account_number: string;
  bank: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}

export interface PaymentMethod {
  id: string;
  card_type: string;
  last_four: string;
  expiry_date: string;
}

export interface BankAccountFormData {
  name: string;
  bank: string;
  account_number: string;
  initial_balance: number;
}

export interface CustomerContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  is_primary: boolean;
}

export interface CustomerNote {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  important: boolean;
}

export interface CustomerJobHistory {
  job_id: string;
  job_number: string;
  title: string;
  date: string;
  status: string;
  amount?: number;
}
