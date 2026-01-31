import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // ✅ 让它自动从 #access_token 里抓 session
      flowType: "implicit",      // ✅ 你现在邮件返回的是 hash token，就用 implicit
    },
  }
)
