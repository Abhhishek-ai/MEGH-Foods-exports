import { createClient } from '@supabase/supabase-js'

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return false
  if (url.includes('your-project') || url.includes('placeholder')) return false
  if (key.includes('your-supabase-anon-key') || key.includes('placeholder')) return false

  return true
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const publicClient = () =>
  createClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  )
