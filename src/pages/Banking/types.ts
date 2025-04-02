
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
