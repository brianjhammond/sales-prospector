import type { CrawlResult } from '@/services/crawler'

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
      searches: {
        Row: {
          id: string
          user_id: string
          urls: string[]
          results: CrawlResult[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          urls: string[]
          results: CrawlResult[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          urls?: string[]
          results?: CrawlResult[]
          created_at?: string
        }
      }
    }
  }
}

export type Search = Database['public']['Tables']['searches']['Row']
export type NewSearch = Database['public']['Tables']['searches']['Insert']
export type UpdateSearch = Database['public']['Tables']['searches']['Update'] 