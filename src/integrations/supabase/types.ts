export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      animals: {
        Row: {
          age: number | null
          breed: string | null
          coloring: string | null
          country: string | null
          created_at: string
          dam: string | null
          height_cm: number | null
          id: string
          image_urls: string[] | null
          is_pony: boolean
          microchip_number: string | null
          name: string
          national_representation: boolean | null
          passport_number: string | null
          registration_info: Json | null
          sire: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          breed?: string | null
          coloring?: string | null
          country?: string | null
          created_at?: string
          dam?: string | null
          height_cm?: number | null
          id?: string
          image_urls?: string[] | null
          is_pony?: boolean
          microchip_number?: string | null
          name: string
          national_representation?: boolean | null
          passport_number?: string | null
          registration_info?: Json | null
          sire?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          breed?: string | null
          coloring?: string | null
          country?: string | null
          created_at?: string
          dam?: string | null
          height_cm?: number | null
          id?: string
          image_urls?: string[] | null
          is_pony?: boolean
          microchip_number?: string | null
          name?: string
          national_representation?: boolean | null
          passport_number?: string | null
          registration_info?: Json | null
          sire?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      competition_results: {
        Row: {
          animal_id: string
          competition_date: string | null
          competition_name: string
          created_at: string
          faults: number | null
          fence_height_cm: number | null
          id: string
          location: string | null
          notes: string | null
          placement: number | null
          rider_name: string | null
          time_seconds: number | null
          total_competitors: number | null
        }
        Insert: {
          animal_id: string
          competition_date?: string | null
          competition_name: string
          created_at?: string
          faults?: number | null
          fence_height_cm?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          placement?: number | null
          rider_name?: string | null
          time_seconds?: number | null
          total_competitors?: number | null
        }
        Update: {
          animal_id?: string
          competition_date?: string | null
          competition_name?: string
          created_at?: string
          faults?: number | null
          fence_height_cm?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          placement?: number | null
          rider_name?: string | null
          time_seconds?: number | null
          total_competitors?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competition_results_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      for_sale_listings: {
        Row: {
          ai_generated_description: string | null
          animal_id: string
          contact_info: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          is_active: boolean | null
          price: number | null
          seller_id: string
          updated_at: string
        }
        Insert: {
          ai_generated_description?: string | null
          animal_id: string
          contact_info?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          seller_id: string
          updated_at?: string
        }
        Update: {
          ai_generated_description?: string | null
          animal_id?: string
          contact_info?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "for_sale_listings_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "for_sale_listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      horses: {
        Row: {
          admin_nf: string | null
          breed: string | null
          color: string | null
          country_of_birth: string | null
          dam: string | null
          date_of_birth: string | null
          fei_id: string | null
          id: string
          is_pony: boolean | null
          last_scraped_at: string | null
          microchip: string | null
          name: string | null
          sex: string | null
          sire: string | null
          sire_of_dam: string | null
          studbook: string | null
          ueln: string | null
          verified_source: string | null
        }
        Insert: {
          admin_nf?: string | null
          breed?: string | null
          color?: string | null
          country_of_birth?: string | null
          dam?: string | null
          date_of_birth?: string | null
          fei_id?: string | null
          id?: string
          is_pony?: boolean | null
          last_scraped_at?: string | null
          microchip?: string | null
          name?: string | null
          sex?: string | null
          sire?: string | null
          sire_of_dam?: string | null
          studbook?: string | null
          ueln?: string | null
          verified_source?: string | null
        }
        Update: {
          admin_nf?: string | null
          breed?: string | null
          color?: string | null
          country_of_birth?: string | null
          dam?: string | null
          date_of_birth?: string | null
          fei_id?: string | null
          id?: string
          is_pony?: boolean | null
          last_scraped_at?: string | null
          microchip?: string | null
          name?: string | null
          sex?: string | null
          sire?: string | null
          sire_of_dam?: string | null
          studbook?: string | null
          ueln?: string | null
          verified_source?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          contact_email: string | null
          country: string | null
          created_at: string
          id: string
          is_verified_seller: boolean | null
          stable_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_verified_seller?: boolean | null
          stable_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_email?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_verified_seller?: boolean | null
          stable_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      results: {
        Row: {
          competition_date: string | null
          competition_name: string | null
          event_name: string | null
          faults: string | null
          horse_fei_id: string | null
          id: string
          location: string | null
          obstacle_height_cm: number | null
          result_place: string | null
          rider_name: string | null
          show_name: string | null
        }
        Insert: {
          competition_date?: string | null
          competition_name?: string | null
          event_name?: string | null
          faults?: string | null
          horse_fei_id?: string | null
          id?: string
          location?: string | null
          obstacle_height_cm?: number | null
          result_place?: string | null
          rider_name?: string | null
          show_name?: string | null
        }
        Update: {
          competition_date?: string | null
          competition_name?: string | null
          event_name?: string | null
          faults?: string | null
          horse_fei_id?: string | null
          id?: string
          location?: string | null
          obstacle_height_cm?: number | null
          result_place?: string | null
          rider_name?: string | null
          show_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "results_horse_fei_id_fkey"
            columns: ["horse_fei_id"]
            isOneToOne: false
            referencedRelation: "horses"
            referencedColumns: ["fei_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
