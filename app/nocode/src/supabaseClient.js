import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',          // ✅ 关键：不用 #access_token 了
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
})
