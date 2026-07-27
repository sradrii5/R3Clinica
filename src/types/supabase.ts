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
      blog_posts: {
        Row: {
          autor_id: string | null
          categoria: Database["public"]["Enums"]["categoria_servicio"] | null
          contenido: string | null
          created_at: string
          id: string
          imagen_url: string | null
          publicado: boolean
          published_at: string | null
          resumen: string | null
          slug: string
          tags: string[] | null
          titulo: string
          updated_at: string
        }
        Insert: {
          autor_id?: string | null
          categoria?: Database["public"]["Enums"]["categoria_servicio"] | null
          contenido?: string | null
          created_at?: string
          id?: string
          imagen_url?: string | null
          publicado?: boolean
          published_at?: string | null
          resumen?: string | null
          slug: string
          tags?: string[] | null
          titulo: string
          updated_at?: string
        }
        Update: {
          autor_id?: string | null
          categoria?: Database["public"]["Enums"]["categoria_servicio"] | null
          contenido?: string | null
          created_at?: string
          id?: string
          imagen_url?: string | null
          publicado?: boolean
          published_at?: string | null
          resumen?: string | null
          slug?: string
          tags?: string[] | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "miembros_equipo"
            referencedColumns: ["id"]
          },
        ]
      }
      instalaciones: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          imagen_url: string
          orden: number
          titulo: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          imagen_url: string
          orden?: number
          titulo: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          imagen_url?: string
          orden?: number
          titulo?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          apellidos: string | null
          cargo_contacto: string | null
          created_at: string
          descripcion_necesidad: string | null
          email: string
          estado: Database["public"]["Enums"]["estado_lead"]
          id: string
          ip_origen: unknown
          mensaje: string | null
          nombre: string
          nombre_empresa: string | null
          num_empleados: number | null
          origen: string
          sector: string | null
          servicio_interes:
            | Database["public"]["Enums"]["categoria_servicio"]
            | null
          telefono: string | null
          tipo: Database["public"]["Enums"]["tipo_cliente"]
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          whatsapp_enviado: boolean
        }
        Insert: {
          apellidos?: string | null
          cargo_contacto?: string | null
          created_at?: string
          descripcion_necesidad?: string | null
          email: string
          estado?: Database["public"]["Enums"]["estado_lead"]
          id?: string
          ip_origen?: unknown
          mensaje?: string | null
          nombre: string
          nombre_empresa?: string | null
          num_empleados?: number | null
          origen?: string
          sector?: string | null
          servicio_interes?:
            | Database["public"]["Enums"]["categoria_servicio"]
            | null
          telefono?: string | null
          tipo?: Database["public"]["Enums"]["tipo_cliente"]
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp_enviado?: boolean
        }
        Update: {
          apellidos?: string | null
          cargo_contacto?: string | null
          created_at?: string
          descripcion_necesidad?: string | null
          email?: string
          estado?: Database["public"]["Enums"]["estado_lead"]
          id?: string
          ip_origen?: unknown
          mensaje?: string | null
          nombre?: string
          nombre_empresa?: string | null
          num_empleados?: number | null
          origen?: string
          sector?: string | null
          servicio_interes?:
            | Database["public"]["Enums"]["categoria_servicio"]
            | null
          telefono?: string | null
          tipo?: Database["public"]["Enums"]["tipo_cliente"]
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp_enviado?: boolean
        }
        Relationships: []
      }
      miembros_equipo: {
        Row: {
          activo: boolean
          apellidos: string | null
          bio: string | null
          cargo: string
          created_at: string
          especialidades: string[] | null
          foto_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          nombre: string
          orden: number
          updated_at: string
        }
        Insert: {
          activo?: boolean
          apellidos?: string | null
          bio?: string | null
          cargo: string
          created_at?: string
          especialidades?: string[] | null
          foto_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          nombre: string
          orden?: number
          updated_at?: string
        }
        Update: {
          activo?: boolean
          apellidos?: string | null
          bio?: string | null
          cargo?: string
          created_at?: string
          especialidades?: string[] | null
          foto_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          nombre?: string
          orden?: number
          updated_at?: string
        }
        Relationships: []
      }
      servicios: {
        Row: {
          activo: boolean
          categoria: Database["public"]["Enums"]["categoria_servicio"]
          created_at: string
          descripcion: string | null
          descripcion_corta: string | null
          icono_url: string | null
          id: string
          imagen_url: string | null
          nombre: string
          orden: number
          precio_desde: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          categoria: Database["public"]["Enums"]["categoria_servicio"]
          created_at?: string
          descripcion?: string | null
          descripcion_corta?: string | null
          icono_url?: string | null
          id?: string
          imagen_url?: string | null
          nombre: string
          orden?: number
          precio_desde?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          categoria?: Database["public"]["Enums"]["categoria_servicio"]
          created_at?: string
          descripcion?: string | null
          descripcion_corta?: string | null
          icono_url?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string
          orden?: number
          precio_desde?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonios: {
        Row: {
          avatar_url: string | null
          cargo_empresa: string | null
          contenido: string
          created_at: string
          destacado: boolean
          id: string
          nombre_cliente: string
          publicado: boolean
          puntuacion: number | null
          servicio_id: string | null
          tipo: Database["public"]["Enums"]["tipo_cliente"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cargo_empresa?: string | null
          contenido: string
          created_at?: string
          destacado?: boolean
          id?: string
          nombre_cliente: string
          publicado?: boolean
          puntuacion?: number | null
          servicio_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_cliente"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cargo_empresa?: string | null
          contenido?: string
          created_at?: string
          destacado?: boolean
          id?: string
          nombre_cliente?: string
          publicado?: boolean
          puntuacion?: number | null
          servicio_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_cliente"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonios_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          id: string
          nombre: string
          apellidos: string
          foto_url: string | null
          objetivo: string | null
          es_admin: boolean
          fecha_alta: string | null
          created_at: string
          updated_at: string
          email: string | null
          activo: boolean
        }
        Insert: {
          id: string
          nombre: string
          apellidos: string
          foto_url?: string | null
          objetivo?: string | null
          es_admin?: boolean
          fecha_alta?: string | null
          created_at?: string
          updated_at?: string
          email?: string | null
          activo?: boolean
        }
        Update: {
          id?: string
          nombre?: string
          apellidos?: string
          foto_url?: string | null
          objetivo?: string | null
          es_admin?: boolean
          fecha_alta?: string | null
          created_at?: string
          updated_at?: string
          email?: string | null
          activo?: boolean
        }
        Relationships: []
      }
      rutinas: {
        Row: {
          id: string
          cliente_id: string
          nombre: string
          descripcion: string | null
          activa: boolean
          fecha_inicio: string | null
          fecha_fin: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          nombre: string
          descripcion?: string | null
          activa?: boolean
          fecha_inicio?: string | null
          fecha_fin?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          nombre?: string
          descripcion?: string | null
          activa?: boolean
          fecha_inicio?: string | null
          fecha_fin?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      catalogo_ejercicios: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          grupo_muscular: string
          imagen_url: string | null
          video_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          grupo_muscular: string
          imagen_url?: string | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          grupo_muscular?: string
          imagen_url?: string | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ejercicios: {
        Row: {
          id: string
          rutina_id: string
          nombre: string
          series: number
          repeticiones: string
          imagen_url: string | null
          video_url: string | null
          orden: number
          notas: string | null
          created_at: string
          dia_semana: string
          fecha: string | null
        }
        Insert: {
          id?: string
          rutina_id: string
          nombre: string
          series?: number
          repeticiones?: string
          imagen_url?: string | null
          video_url?: string | null
          orden?: number
          notas?: string | null
          created_at?: string
          dia_semana?: string
          fecha?: string | null
        }
        Update: {
          id?: string
          rutina_id?: string
          nombre?: string
          series?: number
          repeticiones?: string
          imagen_url?: string | null
          video_url?: string | null
          orden?: number
          notes?: string | null
          created_at?: string
          dia_semana?: string
          fecha?: string | null
        }
        Relationships: []
      }
      planes_nutricionales: {
        Row: {
          id: string
          cliente_id: string
          nombre: string
          descripcion: string | null
          calorias_objetivo: number | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          nombre: string
          descripcion?: string | null
          calorias_objetivo?: number | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          nombre?: string
          descripcion?: string | null
          calorias_objetivo?: number | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      comidas: {
        Row: {
          id: string
          plan_id: string
          nombre: string
          descripcion: string | null
          orden: number
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          nombre: string
          descripcion?: string | null
          orden?: number
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          nombre?: string
          descripcion?: string | null
          orden?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      categoria_servicio:
        | "entrenamiento"
        | "fisioterapia"
        | "nutricion"
        | "readaptacion"
        | "antiaging"
        | "biohacking"
      estado_lead: "nuevo" | "contactado" | "convertido" | "descartado"
      tipo_cliente: "particular" | "empresa"
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
    Enums: {
      categoria_servicio: [
        "entrenamiento",
        "fisioterapia",
        "nutricion",
        "readaptacion",
        "antiaging",
        "biohacking",
      ],
      estado_lead: ["nuevo", "contactado", "convertido", "descartado"],
      tipo_cliente: ["particular", "empresa"],
    },
  },
} as const
