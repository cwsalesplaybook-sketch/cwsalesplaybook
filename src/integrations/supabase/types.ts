export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      content_overrides: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      google_calendar_connections: {
        Row: {
          connected_at: string
          last_synced_at: string | null
          refresh_token: string
          user_id: string
        }
        Insert: {
          connected_at?: string
          last_synced_at?: string | null
          refresh_token: string
          user_id: string
        }
        Update: {
          connected_at?: string
          last_synced_at?: string | null
          refresh_token?: string
          user_id?: string
        }
        Relationships: []
      }
      kanban_reunioes: {
        Row: {
          closer: string | null
          contato: string
          created_at: string
          etapa: string
          google_event_id: string | null
          horario: string | null
          id: string
          notas: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          closer?: string | null
          contato: string
          created_at?: string
          etapa?: string
          google_event_id?: string | null
          horario?: string | null
          id?: string
          notas?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          closer?: string | null
          contato?: string
          created_at?: string
          etapa?: string
          google_event_id?: string | null
          horario?: string | null
          id?: string
          notas?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          checked_ids: string[]
          done_items: number
          percent: number
          total_items: number
          updated_at: string
          user_id: string
        }
        Insert: {
          checked_ids?: string[]
          done_items?: number
          percent?: number
          total_items?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          checked_ids?: string[]
          done_items?: number
          percent?: number
          total_items?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promocoes: {
        Row: {
          concluida_at: string | null
          created_at: string
          novo_papel: string
          novo_squad: string | null
          promovido_por: string | null
          status: string
          user_id: string
        }
        Insert: {
          concluida_at?: string | null
          created_at?: string
          novo_papel: string
          novo_squad?: string | null
          promovido_por?: string | null
          status?: string
          user_id: string
        }
        Update: {
          concluida_at?: string | null
          created_at?: string
          novo_papel?: string
          novo_squad?: string | null
          promovido_por?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      rag_chunks: {
        Row: {
          content: string
          content_tsv: unknown
          id: string
          source: string
          source_url: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content: string
          content_tsv?: unknown
          id?: string
          source: string
          source_url: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          content_tsv?: unknown
          id?: string
          source?: string
          source_url?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reps_agenda_reunioes: {
        Row: {
          agendada_em: string
          created_at: string
          created_by: string | null
          data: string
          hora: string | null
          id: string
          lead_email: string | null
          lead_nome: string | null
          lead_telefone: string | null
          pipedrive_activity_id: number | null
          presenca: string | null
          responsavel: string
          updated_at: string
        }
        Insert: {
          agendada_em: string
          created_at?: string
          created_by?: string | null
          data: string
          hora?: string | null
          id?: string
          lead_email?: string | null
          lead_nome?: string | null
          lead_telefone?: string | null
          pipedrive_activity_id?: number | null
          presenca?: string | null
          responsavel: string
          updated_at?: string
        }
        Update: {
          agendada_em?: string
          created_at?: string
          created_by?: string | null
          data?: string
          hora?: string | null
          id?: string
          lead_email?: string | null
          lead_nome?: string | null
          lead_telefone?: string | null
          pipedrive_activity_id?: number | null
          presenca?: string | null
          responsavel?: string
          updated_at?: string
        }
        Relationships: []
      }
      roleplay_scores: {
        Row: {
          created_at: string
          desfecho: string
          dificuldade: string
          id: string
          jogadas: Json
          nome_exibicao: string
          persona_id: string
          pontos: number
          raiz_revelada: boolean
          rank: string
          turnos: number
          user_id: string
        }
        Insert: {
          created_at?: string
          desfecho: string
          dificuldade: string
          id?: string
          jogadas?: Json
          nome_exibicao: string
          persona_id: string
          pontos: number
          raiz_revelada?: boolean
          rank: string
          turnos: number
          user_id: string
        }
        Update: {
          created_at?: string
          desfecho?: string
          dificuldade?: string
          id?: string
          jogadas?: Json
          nome_exibicao?: string
          persona_id?: string
          pontos?: number
          raiz_revelada?: boolean
          rank?: string
          turnos?: number
          user_id?: string
        }
        Relationships: []
      }
      sdr_profiles: {
        Row: {
          apelido: string | null
          cargo_lideranca: string | null
          cargo_representante: string | null
          created_at: string
          email: string | null
          onboarding_done: boolean
          papel: string | null
          squad: string | null
          squads_lideradas: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          apelido?: string | null
          cargo_lideranca?: string | null
          cargo_representante?: string | null
          created_at?: string
          email?: string | null
          onboarding_done?: boolean
          papel?: string | null
          squad?: string | null
          squads_lideradas?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          apelido?: string | null
          cargo_lideranca?: string | null
          cargo_representante?: string | null
          created_at?: string
          email?: string | null
          onboarding_done?: boolean
          papel?: string | null
          squad?: string | null
          squads_lideradas?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      squad_kpis: {
        Row: {
          mes: string
          meta_agendamentos_dia: number
          meta_clientes: number
          meta_clientes_dia: number
          meta_ltr: number
          meta_no_show: number
          squad: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          mes: string
          meta_agendamentos_dia?: number
          meta_clientes?: number
          meta_clientes_dia?: number
          meta_ltr?: number
          meta_no_show?: number
          squad: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          mes?: string
          meta_agendamentos_dia?: number
          meta_clientes?: number
          meta_clientes_dia?: number
          meta_ltr?: number
          meta_no_show?: number
          squad?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      team_metas: {
        Row: {
          mega1: number
          mega2: number
          mega3: number
          mes: string
          meta1: number
          meta2: number
          meta3: number
          squad: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          mega1?: number
          mega2?: number
          mega3?: number
          mes: string
          meta1?: number
          meta2?: number
          meta3?: number
          squad: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          mega1?: number
          mega2?: number
          mega3?: number
          mes?: string
          meta1?: number
          meta2?: number
          meta3?: number
          squad?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_metas: {
        Row: {
          ajuste: number | null
          created_at: string | null
          dias_uteis: number | null
          id: string
          mega1: number | null
          mega2: number | null
          mega3: number | null
          mes: string
          meta1: number | null
          meta2: number | null
          meta3: number | null
          sdr_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ajuste?: number | null
          created_at?: string | null
          dias_uteis?: number | null
          id?: string
          mega1?: number | null
          mega2?: number | null
          mega3?: number | null
          mes: string
          meta1?: number | null
          meta2?: number | null
          meta3?: number | null
          sdr_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ajuste?: number | null
          created_at?: string | null
          dias_uteis?: number | null
          id?: string
          mega1?: number | null
          mega2?: number | null
          mega3?: number | null
          mes?: string
          meta1?: number | null
          meta2?: number | null
          meta3?: number | null
          sdr_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      lidero_o_usuario: { Args: { alvo: string }; Returns: boolean }
      match_rag_chunks: {
        Args: { match_count?: number; query_text: string }
        Returns: {
          content: string
          id: string
          rank: number
          source: string
          source_url: string
          title: string
        }[]
      }
      mesmo_squad: { Args: { alvo: string }; Returns: boolean }
      meu_squad: { Args: never; Returns: string }
      squads_que_lidero: { Args: never; Returns: string[] }
      to_or_tsquery: {
        Args: { config: unknown; txt: string }
        Returns: unknown
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
