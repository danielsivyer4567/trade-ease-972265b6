import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Service for executing SQL queries against Supabase
 */
export const sqlService = {
  /**
   * Execute a raw SQL query
   * @param query SQL query to execute
   * @returns Result of the query
   */
  async executeQuery(query: string) {
    try {
      // Check if we have a user session first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        toast.error("You must be logged in to execute SQL queries");
        return { error: "No authenticated session" };
      }

      // Execute the raw SQL query
      const { data, error } = await supabase.rpc('execute_sql', { sql_query: query });
      
      if (error) {
        console.error("SQL query execution error:", error);
        toast.error(`Error executing SQL query: ${error.message}`);
        return { error };
      }
      
      toast.success("SQL query executed successfully");
      return { data };
    } catch (error) {
      console.error("Error in executeQuery:", error);
      toast.error("An unexpected error occurred while executing the SQL query");
      return { error };
    }
  },

  /**
   * Enable Row Level Security (RLS) on a table
   * @param tableName Name of the table
   * @returns Result of the operation
   */
  async enableRLS(tableName: string) {
    const query = `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;`;
    return this.executeQuery(query);
  },

  /**
   * Create a Row Level Security policy
   * @param policyName Name of the policy
   * @param tableName Name of the table
   * @param operation Operation (SELECT, INSERT, UPDATE, DELETE, ALL)
   * @param using USING expression for the policy
   * @param withCheck WITH CHECK expression for the policy
   * @returns Result of the operation
   */
  async createRLSPolicy(
    policyName: string, 
    tableName: string, 
    operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL',
    using: string,
    withCheck?: string
  ) {
    let query = `
      CREATE POLICY "${policyName}"
      ON ${tableName}
      FOR ${operation}
      USING (${using})
    `;
    
    if (withCheck) {
      query += `WITH CHECK (${withCheck})`;
    }
    
    query += ';';
    
    return this.executeQuery(query);
  },

  /**
   * Set up Row Level Security policies for the customers table
   * This creates typical policies for a multi-tenant application where users can only
   * access their own data.
   * @returns Result of the operation
   */
  async setupCustomersRLS() {
    try {
      // First enable RLS on the table
      const enableResult = await this.enableRLS('customers');
      if (enableResult.error) {
        return enableResult;
      }
      
      // Create policies for each operation
      
      // 1. SELECT policy - users can only see their own customers
      const selectResult = await this.createRLSPolicy(
        'customers_select_policy',
        'customers',
        'SELECT',
        'auth.uid() = user_id'
      );
      
      if (selectResult.error) {
        return selectResult;
      }
      
      // 2. INSERT policy - users can only insert customers that belong to them
      const insertResult = await this.createRLSPolicy(
        'customers_insert_policy',
        'customers',
        'INSERT',
        'true',
        'auth.uid() = user_id'
      );
      
      if (insertResult.error) {
        return insertResult;
      }
      
      // 3. UPDATE policy - users can only update their own customers
      const updateResult = await this.createRLSPolicy(
        'customers_update_policy',
        'customers',
        'UPDATE',
        'auth.uid() = user_id'
      );
      
      if (updateResult.error) {
        return updateResult;
      }
      
      // 4. DELETE policy - users can only delete their own customers
      const deleteResult = await this.createRLSPolicy(
        'customers_delete_policy',
        'customers',
        'DELETE',
        'auth.uid() = user_id'
      );
      
      toast.success("RLS policies for customers table set up successfully");
      return { success: true };
    } catch (error) {
      console.error("Error setting up customers RLS policies:", error);
      toast.error("Failed to set up RLS policies for customers table");
      return { error };
    }
  }
}; 