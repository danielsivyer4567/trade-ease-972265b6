/**
 * AI-Powered Accounting Service
 * Handles automatic categorization, data extraction, and financial analysis
 * Similar to Xero but with enhanced AI capabilities
 */

import { supabase } from '@/integrations/supabase/client';

export interface FinancialTransaction {
  id?: string;
  amount: number;
  description: string;
  date: string;
  vendor?: string;
  category?: string;
  subcategory?: string;
  account_id: string;
  type: 'credit' | 'debit';
  tax_amount?: number;
  tax_rate?: number;
  reference_number?: string;
  is_billable?: boolean;
  project_id?: string;
  confidence_score?: number;
  ai_processed?: boolean;
}

export interface DocumentData {
  file: File;
  extracted_text?: string;
  transaction_data?: FinancialTransaction;
}

export class AIAccountingService {
  private static instance: AIAccountingService;
  
  private constructor() {}
  
  public static getInstance(): AIAccountingService {
    if (!AIAccountingService.instance) {
      AIAccountingService.instance = new AIAccountingService();
    }
    return AIAccountingService.instance;
  }

  /**
   * Process uploaded documents (receipts, invoices, statements) with AI
   */
  async processFinancialDocument(file: File, accountId: string): Promise<FinancialTransaction | null> {
    try {
      console.log('🤖 Processing financial document with AI...');
      
      // Step 1: OCR Processing via existing Vision API
      const visionData = await this.extractTextFromDocument(file);
      
      if (!visionData.success || !visionData.extracted_text) {
        throw new Error('Failed to extract text from document');
      }

      // Step 2: AI-powered financial data extraction
      const transactionData = await this.extractFinancialDataWithAI(
        visionData.extracted_text, 
        file.name,
        accountId
      );

      // Step 3: Smart categorization
      const categorizedData = await this.categorizeTransactionAI(transactionData);

      // Step 4: Save to database
      const savedTransaction = await this.saveTransaction(categorizedData);

      console.log('✅ Document processed successfully:', savedTransaction.id);
      return savedTransaction;

    } catch (error) {
      console.error('❌ Error processing document:', error);
      throw error;
    }
  }

  /**
   * Extract text from document using existing Vision API
   */
  private async extractTextFromDocument(file: File): Promise<{success: boolean, extracted_text?: string}> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('gcp-vision-analyze', {
        body: formData
      });

      if (error) throw error;

      const extractedText = data?.visionResult?.responses?.[0]?.fullTextAnnotation?.text;
      
      return {
        success: true,
        extracted_text: extractedText
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      return { success: false };
    }
  }

  /**
   * Extract financial data using AI/OpenAI
   */
  private async extractFinancialDataWithAI(
    text: string, 
    filename: string,
    accountId: string
  ): Promise<FinancialTransaction> {
    try {
      // Use existing OpenAI integration
      const { data, error } = await supabase.functions.invoke('generate-with-openai', {
        body: {
          prompt: this.createFinancialExtractionPrompt(text),
          max_tokens: 500,
          temperature: 0.1
        }
      });

      if (error) throw error;

      const aiResponse = data.choices?.[0]?.message?.content;
      const extractedData = this.parseAIFinancialResponse(aiResponse);

      return {
        amount: extractedData.amount || 0,
        description: extractedData.description || `Document: ${filename}`,
        date: extractedData.date || new Date().toISOString().split('T')[0],
        type: extractedData.type || 'debit',
        account_id: accountId,
        ...extractedData,
        reference_number: this.generateReferenceNumber(filename),
        ai_processed: true,
        confidence_score: this.calculateConfidenceScore(text, extractedData)
      };

    } catch (error) {
      console.error('AI extraction failed:', error);
      // Fallback to basic extraction
      return this.fallbackBasicExtraction(text, filename, accountId);
    }
  }

  /**
   * Create AI prompt for financial data extraction
   */
  private createFinancialExtractionPrompt(text: string): string {
    return `
Analyze this financial document and extract key information in JSON format:

Document Text:
${text}

Extract the following information and return as valid JSON:
{
  "amount": <number>,
  "description": "<description>",
  "vendor": "<vendor/company name>",
  "date": "<YYYY-MM-DD format>",
  "type": "credit|debit",
  "category": "<expense category>",
  "subcategory": "<subcategory>",
  "tax_amount": <number if present>,
  "tax_rate": <percentage if present>,
  "is_billable": <boolean>
}

Categories include: Office Supplies, Equipment, Materials, Vehicle, Fuel, Insurance, Utilities, Professional Services, Marketing, Travel, Meals, etc.

Determine if this is a debit (expense/payment) or credit (income/receipt).
If amount is unclear, extract the largest monetary value mentioned.
Use today's date if date is unclear.
`;
  }

  /**
   * Parse AI response for financial data
   */
  private parseAIFinancialResponse(response: string): Partial<FinancialTransaction> {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        amount: Math.abs(parseFloat(parsed.amount) || 0),
        description: parsed.description || 'Unknown transaction',
        vendor: parsed.vendor || 'Unknown vendor',
        date: parsed.date || new Date().toISOString().split('T')[0],
        type: parsed.type === 'credit' ? 'credit' : 'debit',
        category: parsed.category || 'Uncategorized',
        subcategory: parsed.subcategory,
        tax_amount: parseFloat(parsed.tax_amount) || 0,
        tax_rate: parseFloat(parsed.tax_rate) || 0,
        is_billable: Boolean(parsed.is_billable)
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {};
    }
  }

  /**
   * Categorize transaction using AI
   */
  async categorizeTransactionAI(transaction: Partial<FinancialTransaction>): Promise<FinancialTransaction> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-with-openai', {
        body: {
          prompt: this.createCategorizationPrompt(transaction),
          max_tokens: 200,
          temperature: 0.1
        }
      });

      if (error) throw error;

      const aiResponse = data.choices?.[0]?.message?.content;
      const categoryData = this.parseCategoryResponse(aiResponse);

      return {
        ...transaction,
        ...categoryData,
        confidence_score: Math.min((transaction.confidence_score || 0) + 0.1, 1.0)
      } as FinancialTransaction;

    } catch (error) {
      console.error('AI categorization failed:', error);
      return transaction as FinancialTransaction;
    }
  }

  /**
   * Create categorization prompt
   */
  private createCategorizationPrompt(transaction: Partial<FinancialTransaction>): string {
    return `
Categorize this business transaction for accounting purposes:

Amount: $${transaction.amount}
Description: ${transaction.description}
Vendor: ${transaction.vendor}
Type: ${transaction.type}

Return JSON with enhanced categorization:
{
  "category": "<primary category>",
  "subcategory": "<specific subcategory>",
  "is_billable": <boolean>,
  "tax_deductible": <boolean>,
  "expense_type": "operating|capital|cost_of_goods"
}

Use standard business categories:
- Office Supplies, Equipment, Materials, Vehicle Expenses, Professional Services
- Marketing, Travel, Meals & Entertainment, Utilities, Insurance, etc.
`;
  }

  /**
   * Parse categorization response
   */
  private parseCategoryResponse(response: string): Partial<FinancialTransaction> {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return {};
      
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        category: parsed.category,
        subcategory: parsed.subcategory,
        is_billable: Boolean(parsed.is_billable)
      };
    } catch (error) {
      return {};
    }
  }

  /**
   * Import transactions from integrated apps
   */
  async importFromIntegration(integration: string, accountId: string): Promise<FinancialTransaction[]> {
    try {
      console.log(`🔄 Importing transactions from ${integration}...`);
      
      const importedTransactions: FinancialTransaction[] = [];
      
      switch (integration.toLowerCase()) {
        case 'xero':
          return await this.importFromXero(accountId);
        case 'quickbooks':
          return await this.importFromQuickBooks(accountId);
        case 'stripe':
          return await this.importFromStripe(accountId);
        case 'paypal':
          return await this.importFromPayPal(accountId);
        default:
          throw new Error(`Integration ${integration} not supported`);
      }
      
    } catch (error) {
      console.error(`Failed to import from ${integration}:`, error);
      throw error;
    }
  }

  /**
   * Import from Xero
   */
  private async importFromXero(accountId: string): Promise<FinancialTransaction[]> {
    // Implementation for Xero API integration
    // This would use your existing Xero integration
    try {
      const { data, error } = await supabase.functions.invoke('xero-token-exchange', {
        body: { action: 'fetch_transactions' }
      });

      if (error) throw error;

      return data.transactions?.map((xeroTxn: any) => ({
        amount: Math.abs(xeroTxn.Total || 0),
        description: xeroTxn.Description || xeroTxn.Reference,
        date: xeroTxn.Date,
        vendor: xeroTxn.Contact?.Name || 'Unknown',
        type: xeroTxn.Total > 0 ? 'credit' : 'debit',
        category: xeroTxn.LineItems?.[0]?.AccountCode || 'Uncategorized',
        account_id: accountId,
        reference_number: xeroTxn.Reference,
        ai_processed: false
      })) || [];

    } catch (error) {
      console.error('Xero import failed:', error);
      return [];
    }
  }

  /**
   * Import from QuickBooks
   */
  private async importFromQuickBooks(accountId: string): Promise<FinancialTransaction[]> {
    // Implementation for QuickBooks API integration
    return [];
  }

  /**
   * Import from Stripe
   */
  private async importFromStripe(accountId: string): Promise<FinancialTransaction[]> {
    // Implementation for Stripe API integration
    return [];
  }

  /**
   * Import from PayPal
   */
  private async importFromPayPal(accountId: string): Promise<FinancialTransaction[]> {
    // Implementation for PayPal API integration
    return [];
  }

  /**
   * Save transaction to database
   */
  private async saveTransaction(transaction: FinancialTransaction): Promise<FinancialTransaction> {
    const { data, error } = await supabase
      .from('bank_transactions')
      .insert([{
        account_id: transaction.account_id,
        amount: transaction.type === 'debit' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
        description: transaction.description,
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
        reference_number: transaction.reference_number,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Utility functions
   */
  private fallbackBasicExtraction(text: string, filename: string, accountId: string): FinancialTransaction {
    // Basic regex-based extraction as fallback
    const amountMatch = text.match(/\$?(\d+(?:,\d{3})*\.?\d{0,2})/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 0;
    
    return {
      amount,
      description: `Document: ${filename}`,
      date: new Date().toISOString().split('T')[0],
      vendor: 'Unknown',
      type: 'debit',
      category: 'Uncategorized',
      account_id: accountId,
      reference_number: this.generateReferenceNumber(filename),
      ai_processed: false,
      confidence_score: 0.3
    };
  }

  private generateReferenceNumber(filename: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const fileHash = filename.split('.')[0].slice(-4);
    return `AI-${timestamp}-${fileHash}`.toUpperCase();
  }

  private calculateConfidenceScore(text: string, data: Partial<FinancialTransaction>): number {
    let score = 0.5; // Base score
    
    if (data.amount && data.amount > 0) score += 0.2;
    if (data.vendor && data.vendor !== 'Unknown') score += 0.1;
    if (data.date && data.date !== new Date().toISOString().split('T')[0]) score += 0.1;
    if (data.category && data.category !== 'Uncategorized') score += 0.1;
    
    return Math.min(score, 1.0);
  }
}

export const aiAccountingService = AIAccountingService.getInstance(); 