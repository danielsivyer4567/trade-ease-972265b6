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
      automation_workflow_connections: {
        Row: {
          automation_id: number
          created_at: string
          id: string
          target_id: string | null
          target_type: string | null
          user_id: string
          workflow_id: string
        }
        Insert: {
          automation_id: number
          created_at?: string
          id?: string
          target_id?: string | null
          target_type?: string | null
          user_id: string
          workflow_id: string
        }
        Update: {
          automation_id?: number
          created_at?: string
          id?: string
          target_id?: string | null
          target_type?: string | null
          user_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_workflow_connections_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_number: string
          balance: number
          bank: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number: string
          balance?: number
          bank: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string
          balance?: number
          bank?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bank_transactions: {
        Row: {
          account_id: string
          amount: number
          created_at: string
          date: string
          description: string
          id: string
          type: string
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          date?: string
          description: string
          id?: string
          type: string
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      "banking related": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      calendar_sync_events: {
        Row: {
          connection_id: string
          created_at: string | null
          event_end: string
          event_start: string
          event_title: string
          id: string
          last_synced_at: string | null
          provider_event_id: string | null
          sync_status: string | null
          trade_event_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          connection_id: string
          created_at?: string | null
          event_end: string
          event_start: string
          event_title: string
          id?: string
          last_synced_at?: string | null
          provider_event_id?: string | null
          sync_status?: string | null
          trade_event_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          connection_id?: string
          created_at?: string | null
          event_end?: string
          event_start?: string
          event_title?: string
          id?: string
          last_synced_at?: string | null
          provider_event_id?: string | null
          sync_status?: string | null
          trade_event_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sync_events_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "user_calendar_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          state: string
          status: string
          user_id: string
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          state: string
          status?: string
          user_id: string
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          state?: string
          status?: string
          user_id?: string
          zipcode?: string
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
      jobs: {
        Row: {
          assigned_team: string | null
          created_at: string | null
          customer: string
          date: string | null
          date_undecided: boolean | null
          description: string | null
          id: string
          job_number: string
          location: number[] | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_team?: string | null
          created_at?: string | null
          customer: string
          date?: string | null
          date_undecided?: boolean | null
          description?: string | null
          id?: string
          job_number: string
          location?: number[] | null
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_team?: string | null
          created_at?: string | null
          customer?: string
          date?: string | null
          date_undecided?: boolean | null
          description?: string | null
          id?: string
          job_number?: string
          location?: number[] | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
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
      payment_methods: {
        Row: {
          card_type: string
          created_at: string
          expiry_date: string
          id: string
          last_four: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_type: string
          created_at?: string
          expiry_date: string
          id?: string
          last_four: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_type?: string
          created_at?: string
          expiry_date?: string
          id?: string
          last_four?: string
          updated_at?: string
          user_id?: string
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
      property_boundaries: {
        Row: {
          address: string | null
          boundaries: Json
          created_at: string
          description: string | null
          id: string
          location: number[]
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          boundaries: Json
          created_at?: string
          description?: string | null
          id?: string
          location: number[]
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          boundaries?: Json
          created_at?: string
          description?: string | null
          id?: string
          location?: number[]
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      scheduled_payments: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          frequency: string | null
          from_account_id: string
          id: string
          payment_date: string
          recipient: string
          recurring: boolean | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          frequency?: string | null
          from_account_id: string
          id?: string
          payment_date: string
          recipient: string
          recurring?: boolean | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          frequency?: string | null
          from_account_id?: string
          id?: string
          payment_date?: string
          recipient?: string
          recurring?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_payments_from_account_id_fkey"
            columns: ["from_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      task_assignments: {
        Row: {
          assigned_at: string | null
          id: string
          member_id: string
          member_name: string
          member_role: string
          task_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          member_id: string
          member_name: string
          member_role: string
          task_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          member_id?: string
          member_name?: string
          member_role?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      task_cards: {
        Row: {
          acknowledgment_note: string | null
          assigned_manager: string | null
          assigned_team: string
          attached_files: Json | null
          completion_images: Json | null
          completion_note: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          manager_id: string | null
          progress_files: Json | null
          progress_note: string | null
          status: string
          team_leader_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          acknowledgment_note?: string | null
          assigned_manager?: string | null
          assigned_team: string
          attached_files?: Json | null
          completion_images?: Json | null
          completion_note?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          manager_id?: string | null
          progress_files?: Json | null
          progress_note?: string | null
          status?: string
          team_leader_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          acknowledgment_note?: string | null
          assigned_manager?: string | null
          assigned_team?: string
          attached_files?: Json | null
          completion_images?: Json | null
          completion_note?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          manager_id?: string | null
          progress_files?: Json | null
          progress_note?: string | null
          status?: string
          team_leader_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_team: string
          attached_files: Json | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          manager_id: string | null
          status: string
          team_leader_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_team: string
          attached_files?: Json | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          manager_id?: string | null
          status?: string
          team_leader_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_team?: string
          attached_files?: Json | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          manager_id?: string | null
          status?: string
          team_leader_id?: string | null
          title?: string
          updated_at?: string | null
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
      user_calendar_connections: {
        Row: {
          access_token: string | null
          calendar_id: string | null
          created_at: string | null
          id: string
          provider: string
          provider_id: string | null
          refresh_token: string | null
          sync_enabled: boolean | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          provider: string
          provider_id?: string | null
          refresh_token?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          provider?: string
          provider_id?: string | null
          refresh_token?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
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
      workflows: {
        Row: {
          created_at: string
          data: Json
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
