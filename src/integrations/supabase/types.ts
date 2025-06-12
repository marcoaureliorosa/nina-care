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
      acionamentos_humanos: {
        Row: {
          conversa_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          conversa_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          conversa_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "acionamentos_humanos_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acionamentos_humanos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      conversas: {
        Row: {
          agente: string
          created_at: string
          feedback: string | null
          id: string
          is_priority: boolean | null
          is_read: boolean | null
          paciente_id: string
          procedimento_id: string
          resumo_conversa: string | null
          status: string
          timestamp_ultima_mensagem: string | null
          ultima_mensagem: string | null
          unread_count: number | null
          updated_at: string
        }
        Insert: {
          agente?: string
          created_at?: string
          feedback?: string | null
          id?: string
          is_priority?: boolean | null
          is_read?: boolean | null
          paciente_id: string
          procedimento_id: string
          resumo_conversa?: string | null
          status?: string
          timestamp_ultima_mensagem?: string | null
          ultima_mensagem?: string | null
          unread_count?: number | null
          updated_at?: string
        }
        Update: {
          agente?: string
          created_at?: string
          feedback?: string | null
          id?: string
          is_priority?: boolean | null
          is_read?: boolean | null
          paciente_id?: string
          procedimento_id?: string
          resumo_conversa?: string | null
          status?: string
          timestamp_ultima_mensagem?: string | null
          ultima_mensagem?: string | null
          unread_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_procedimento_id_fkey"
            columns: ["procedimento_id"]
            isOneToOne: false
            referencedRelation: "procedimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      follow_up: {
        Row: {
          created_at: string | null
          dt_envio: string | null
          id: number
          status: string
          tag: string
          user_number: string | null
          userid: string
        }
        Insert: {
          created_at?: string | null
          dt_envio?: string | null
          id?: number
          status?: string
          tag: string
          user_number?: string | null
          userid: string
        }
        Update: {
          created_at?: string | null
          dt_envio?: string | null
          id?: number
          status?: string
          tag?: string
          user_number?: string | null
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      medicos: {
        Row: {
          created_at: string
          crm: string
          email: string
          especialidade: string | null
          id: string
          nome: string
          organizacao_id: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crm: string
          email: string
          especialidade?: string | null
          id?: string
          nome: string
          organizacao_id?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crm?: string
          email?: string
          especialidade?: string | null
          id?: string
          nome?: string
          organizacao_id?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicos_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          conversa_id: string | null
          created_at: string
          id: number
          message: Json
          session_id: string
          updated_at: string | null
        }
        Insert: {
          conversa_id?: string | null
          created_at?: string
          id?: number
          message: Json
          session_id: string
          updated_at?: string | null
        }
        Update: {
          conversa_id?: string | null
          created_at?: string
          id?: number
          message?: Json
          session_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      organizacoes: {
        Row: {
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          procedures_performed: number
          telefone: string | null
          telefone_emergencia: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          procedures_performed?: number
          telefone?: string | null
          telefone_emergencia?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          procedures_performed?: number
          telefone?: string | null
          telefone_emergencia?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pacientes: {
        Row: {
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          email: string | null
          id: string
          nina_status: boolean
          nome: string
          organizacao_id: string
          resumo: string | null
          telefone: string
          updated_at: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          id?: string
          nina_status?: boolean
          nome: string
          organizacao_id: string
          resumo?: string | null
          telefone: string
          updated_at?: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          id?: string
          nina_status?: boolean
          nome?: string
          organizacao_id?: string
          resumo?: string | null
          telefone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      procedimentos: {
        Row: {
          created_at: string
          data_procedimento: string
          id: string
          medico_id: string
          observacoes: string | null
          paciente_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_procedimento: string
          id?: string
          medico_id: string
          observacoes?: string | null
          paciente_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_procedimento?: string
          id?: string
          medico_id?: string
          observacoes?: string | null
          paciente_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedimentos_medico_id_fkey"
            columns: ["medico_id"]
            isOneToOne: false
            referencedRelation: "medicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedimentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          can_manage_organizations: boolean | null
          created_at: string
          email: string
          email_confirmed_at: string | null
          id: string
          invitation_token: string | null
          invited_at: string | null
          is_active: boolean
          nome: string
          organizacao_id: string
          role: Database["public"]["Enums"]["user_role"]
          telefone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          can_manage_organizations?: boolean | null
          created_at?: string
          email: string
          email_confirmed_at?: string | null
          id: string
          invitation_token?: string | null
          invited_at?: string | null
          is_active?: boolean
          nome: string
          organizacao_id: string
          role?: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          can_manage_organizations?: boolean | null
          created_at?: string
          email?: string
          email_confirmed_at?: string | null
          id?: string
          invitation_token?: string | null
          invited_at?: string | null
          is_active?: boolean
          nome?: string
          organizacao_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      satisfacao_cliques: {
        Row: {
          clicado_em: string
          id: string
          origem: string | null
          paciente_id: string
        }
        Insert: {
          clicado_em?: string
          id?: string
          origem?: string | null
          paciente_id: string
        }
        Update: {
          clicado_em?: string
          id?: string
          origem?: string | null
          paciente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "satisfacao_cliques_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_organizations: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          organizacao_id: string
          role: Database["public"]["Enums"]["user_role_enum"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          organizacao_id: string
          role?: Database["public"]["Enums"]["user_role_enum"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          organizacao_id?: string
          role?: Database["public"]["Enums"]["user_role_enum"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_organizations_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_organizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      temp_status_mapping: {
        Row: {
          new_status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      create_patient_with_procedure: {
        Args:
          | {
              p_nome: string
              p_email: string
              p_telefone: string
              proc_medico_id: string
              proc_data_procedimento: string
              proc_observacoes: string
            }
          | {
              patient_nome: string
              patient_cpf: string
              patient_email: string
              patient_telefone: string
              patient_data_nascimento: string
              patient_organizacao_id: string
              proc_medico_id: string
              proc_data_procedimento: string
              proc_observacoes: string
            }
        Returns: Json
      }
      debug_user_creation: {
        Args: { user_email: string }
        Returns: {
          user_id: string
          user_name: string
          user_organizacao_id: string
          org_name: string
          created_at: string
        }[]
      }
      generate_password_reset: {
        Args: { user_email: string }
        Returns: string
      }
      generate_unique_invite_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_org: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_organization: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_permission: {
        Args: { resource: string; action: string }
        Returns: boolean
      }
      has_role: {
        Args: { role: Database["public"]["Enums"]["user_role_enum"] }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authenticated: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      test_new_user_creation: {
        Args: {
          test_email: string
          test_nome: string
          test_role: string
          test_organizacao_id: string
        }
        Returns: {
          step: string
          success: boolean
          details: string
        }[]
      }
      validate_user_organizations: {
        Args: Record<PropertyKey, never>
        Returns: {
          validation_type: string
          count_issues: number
          details: string
        }[]
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      surgery_status:
        | "waiting_qrcode"
        | "first_contact"
        | "preop"
        | "monitoring"
        | "finished"
      user_role: "admin" | "doctor" | "nurse" | "secretary" | "recepcionista"
      user_role_enum:
        | "admin"
        | "doctor"
        | "nurse"
        | "secretary"
        | "recepcionista"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      surgery_status: [
        "waiting_qrcode",
        "first_contact",
        "preop",
        "monitoring",
        "finished",
      ],
      user_role: ["admin", "doctor", "nurse", "secretary", "recepcionista"],
      user_role_enum: [
        "admin",
        "doctor",
        "nurse",
        "secretary",
        "recepcionista",
      ],
    },
  },
} as const
