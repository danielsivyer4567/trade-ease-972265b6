export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_responses: {
        Row: {
          created_at: string
          id: string
          model: string
          prompt: string
          provider: string
          response: string
        }
        Insert: {
          created_at?: string
          id?: string
          model: string
          prompt: string
          provider: string
          response: string
        }
        Update: {
          created_at?: string
          id?: string
          model?: string
          prompt?: string
          provider?: string
          response?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          description: string | null
          due_date: string
          id: string
          invoice_number: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          description?: string | null
          due_date: string
          id?: string
          invoice_number: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          description?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          status?: string
        }
        Relationships: []
      }
      messaging_accounts: {
        Row: {
          account_id: string | null
          account_sid: string | null
          api_key: string | null
          auth_token: string | null
          created_at: string | null
          enabled: boolean | null
          gcp_vision_key: string | null
          id: string
          phone_number: string | null
          service_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_id?: string | null
          account_sid?: string | null
          api_key?: string | null
          auth_token?: string | null
          created_at?: string | null
          enabled?: boolean | null
          gcp_vision_key?: string | null
          id?: string
          phone_number?: string | null
          service_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_id?: string | null
          account_sid?: string | null
          api_key?: string | null
          auth_token?: string | null
          created_at?: string | null
          enabled?: boolean | null
          gcp_vision_key?: string | null
          id?: string
          phone_number?: string | null
          service_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date: string
          payment_method: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_entries: {
        Row: {
          created_at: string
          employee_id: string
          gross_pay: number
          hourly_rate: number
          id: string
          net_pay: number
          overtime_hours: number
          payroll_run_id: string | null
          rdo_balance: number
          rdo_hours: number
          regular_hours: number
          super_contribution: number
          tax_withheld: number
        }
        Insert: {
          created_at?: string
          employee_id: string
          gross_pay: number
          hourly_rate: number
          id?: string
          net_pay: number
          overtime_hours?: number
          payroll_run_id?: string | null
          rdo_balance?: number
          rdo_hours?: number
          regular_hours?: number
          super_contribution: number
          tax_withheld?: number
        }
        Update: {
          created_at?: string
          employee_id?: string
          gross_pay?: number
          hourly_rate?: number
          id?: string
          net_pay?: number
          overtime_hours?: number
          payroll_run_id?: string | null
          rdo_balance?: number
          rdo_hours?: number
          regular_hours?: number
          super_contribution?: number
          tax_withheld?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_entries_payroll_run_id_fkey"
            columns: ["payroll_run_id"]
            isOneToOne: false
            referencedRelation: "payroll_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_runs: {
        Row: {
          created_at: string
          id: string
          pay_period_end: string
          pay_period_start: string
          status: string
          stp_lodgment_id: string | null
          submitted_to_ato: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          pay_period_end: string
          pay_period_start: string
          status?: string
          stp_lodgment_id?: string | null
          submitted_to_ato?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          pay_period_end?: string
          pay_period_start?: string
          status?: string
          stp_lodgment_id?: string | null
          submitted_to_ato?: boolean | null
        }
        Relationships: []
      }
      phone_numbers_for_sale: {
        Row: {
          created_at: string
          id: string
          phone_number: string
          price: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          phone_number: string
          price: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          phone_number?: string
          price?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      price_list_items: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      statistics_history: {
        Row: {
          count: number
          count_date: string
          created_at: string
          entity_type: string
          id: string
        }
        Insert: {
          count: number
          count_date?: string
          created_at?: string
          entity_type: string
          id?: string
        }
        Update: {
          count?: number
          count_date?: string
          created_at?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          created_at: string
          id: number
          text: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          text?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          text?: string | null
        }
        Relationships: []
      }
      user_automations: {
        Row: {
          automation_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          settings: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          automation_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          automation_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users_configuration: {
        Row: {
          automation_enabled: boolean | null
          created_at: string | null
          id: string
          messaging_enabled: boolean | null
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          automation_enabled?: boolean | null
          created_at?: string | null
          id: string
          messaging_enabled?: boolean | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          automation_enabled?: boolean | null
          created_at?: string | null
          id?: string
          messaging_enabled?: boolean | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_configuration_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_database_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_organization_access: {
        Args: {
          org_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
