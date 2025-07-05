/**
 * Banking Demo Data Setup Script
 * Run this script after creating the banking tables to populate sample data
 */

import { supabase } from '../src/integrations/supabase/client.js';

const sampleBankAccounts = [
  {
    name: 'Business Checking',
    bank: 'Chase Bank',
    account_number: '****1234',
    balance: 15420.50,
    account_type: 'checking'
  },
  {
    name: 'Business Savings',
    bank: 'Chase Bank', 
    account_number: '****5678',
    balance: 45000.00,
    account_type: 'savings'
  },
  {
    name: 'Equipment Loan Account',
    bank: 'Wells Fargo',
    account_number: '****9012',
    balance: -12500.00,
    account_type: 'loan'
  }
];

const sampleTransactions = [
  {
    description: 'Customer Payment - Job #2024-001',
    amount: 2500.00,
    type: 'credit',
    category: 'Income',
    reference_number: 'DEP-001',
    date: new Date(Date.now() - 86400000 * 1).toISOString() // 1 day ago
  },
  {
    description: 'Equipment Purchase - Home Depot',
    amount: -450.75,
    type: 'debit',
    category: 'Equipment',
    reference_number: 'CHK-123',
    date: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    description: 'Fuel - Shell Gas Station',
    amount: -89.50,
    type: 'debit',
    category: 'Vehicle',
    reference_number: 'CHK-124',
    date: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
  },
  {
    description: 'Material Supplier Payment',
    amount: -1200.00,
    type: 'debit',
    category: 'Materials',
    reference_number: 'CHK-125',
    date: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
  },
  {
    description: 'Customer Payment - Job #2024-002',
    amount: 3200.00,
    type: 'credit',
    category: 'Income',
    reference_number: 'DEP-002',
    date: new Date(Date.now() - 86400000 * 7).toISOString() // 1 week ago
  }
];

const samplePaymentMethods = [
  {
    card_type: 'Visa Business',
    last_four: '4532',
    expiry_date: '12/2026',
    cardholder_name: 'Business Account',
    is_default: true
  },
  {
    card_type: 'American Express',
    last_four: '9876',
    expiry_date: '08/2025',
    cardholder_name: 'Business Account',
    is_default: false
  }
];

const sampleScheduledPayments = [
  {
    recipient_name: 'Office Rent',
    amount: 1500.00,
    frequency: 'monthly',
    next_payment_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    description: 'Monthly office rent payment'
  },
  {
    recipient_name: 'Equipment Lease',
    amount: 450.00,
    frequency: 'monthly',
    next_payment_date: new Date(Date.now() + 86400000 * 12).toISOString(), // 12 days from now
    description: 'Monthly equipment lease payment'
  }
];

async function setupBankingDemoData() {
  try {
    console.log('🏦 Setting up banking demo data...');

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ No authenticated user found. Please log in first.');
      return;
    }

    console.log('👤 User authenticated:', user.email);

    // Insert bank accounts
    console.log('💳 Creating sample bank accounts...');
    const { data: accounts, error: accountsError } = await supabase
      .from('bank_accounts')
      .insert(sampleBankAccounts.map(account => ({
        ...account,
        user_id: user.id
      })))
      .select();

    if (accountsError) {
      console.error('❌ Error creating accounts:', accountsError);
      return;
    }

    console.log(`✅ Created ${accounts.length} bank accounts`);

    // Insert transactions for the first account
    if (accounts.length > 0) {
      console.log('📊 Creating sample transactions...');
      const { data: transactions, error: transactionsError } = await supabase
        .from('bank_transactions')
        .insert(sampleTransactions.map(transaction => ({
          ...transaction,
          account_id: accounts[0].id,
          user_id: user.id
        })))
        .select();

      if (transactionsError) {
        console.error('❌ Error creating transactions:', transactionsError);
      } else {
        console.log(`✅ Created ${transactions.length} transactions`);
      }
    }

    // Insert payment methods
    console.log('💳 Creating sample payment methods...');
    const { data: paymentMethods, error: paymentMethodsError } = await supabase
      .from('payment_methods')
      .insert(samplePaymentMethods.map(method => ({
        ...method,
        user_id: user.id
      })))
      .select();

    if (paymentMethodsError) {
      console.error('❌ Error creating payment methods:', paymentMethodsError);
    } else {
      console.log(`✅ Created ${paymentMethods.length} payment methods`);
    }

    // Insert scheduled payments
    console.log('📅 Creating sample scheduled payments...');
    const { data: scheduledPayments, error: scheduledPaymentsError } = await supabase
      .from('scheduled_payments')
      .insert(sampleScheduledPayments.map(payment => ({
        ...payment,
        account_id: accounts[0]?.id,
        user_id: user.id
      })))
      .select();

    if (scheduledPaymentsError) {
      console.error('❌ Error creating scheduled payments:', scheduledPaymentsError);
    } else {
      console.log(`✅ Created ${scheduledPayments.length} scheduled payments`);
    }

    console.log('🎉 Banking demo data setup complete!');
    console.log('');
    console.log('You can now:');
    console.log('- View your accounts in the Banking page');
    console.log('- See transaction history');
    console.log('- Manage payment methods');
    console.log('- Set up scheduled payments');

  } catch (error) {
    console.error('❌ Error setting up demo data:', error);
  }
}

// Run the setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupBankingDemoData();
}

export { setupBankingDemoData }; 