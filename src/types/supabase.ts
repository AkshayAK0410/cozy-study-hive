export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string | null
          name: string | null
          avatar: string | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          id: string
          created_at?: string | null
          name?: string | null
          avatar?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string | null
          avatar?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          due_date: string | null
          status: 'todo' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          created_at: string
          tags: string[] | null
          category: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          due_date?: string | null
          status?: 'todo' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          tags?: string[] | null
          category?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          status?: 'todo' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          tags?: string[] | null
          category?: string | null
        }
      }
    }
  }
}
