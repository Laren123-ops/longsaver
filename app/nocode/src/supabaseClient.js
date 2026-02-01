import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // ✅ 让回调页自动处理 URL
      // flowType: "implicit",    // ❌ 删掉
      // flowType: "pkce",        // ✅ 可写可不写（v2 默认就是 pkce）
    },
  }
)
